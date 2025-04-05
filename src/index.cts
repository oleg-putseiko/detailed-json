type Reviver = (this: unknown, key: string, value: unknown) => unknown;

type OverriddenReplacer = Parameters<typeof JSON.stringify>[1];
type Replacer =
  | ((this: unknown, key: string, value: unknown) => unknown)
  | (number | string)[]
  | null;

const isObject = (
  value: unknown,
): value is Record<string | number | symbol, unknown> =>
  typeof value === 'object' && value !== null;

class _Json {
  static parse(text: string, reviver?: Reviver): unknown {
    return JSON.parse(text, reviver);
  }

  static stringify(
    value: unknown,
    replacer?: Replacer,
    space: number = 4,
  ): string {
    return JSON.stringify(
      _Json._toJSON(value),
      replacer as OverriddenReplacer,
      space,
    );
  }

  protected static _toJSON<T>(value: T): T {
    const ancestors: unknown[] = [];

    const convert = (value: unknown, ancestor?: unknown): unknown => {
      if (!isObject(value)) return value;

      while (ancestors.length > 0 && ancestors.at(-1) !== ancestor) {
        ancestors.pop();
      }

      if (ancestors.includes(value)) return '[Circular]';

      ancestors.push(value);

      if (typeof value.toJSON === 'function') {
        return value.toJSON();
      }

      if (Array.isArray(value)) {
        return value.map((item) => convert(item, value)) as T;
      }

      return Object.getOwnPropertyNames(value).reduce<T>((acc, key) => {
        Object.defineProperty(acc, key, {
          value: convert(value[key], value),
          enumerable: true,
        });

        return acc;
      }, {} as T);
    };

    return convert(value) as T;
  }
}

namespace _Json {
  export class Json extends _Json {}
}

export = _Json;
