type Reviver = (this: unknown, key: string, value: unknown) => unknown;

type OverriddenReplacer = Parameters<typeof JSON.stringify>[1];
type Replacer =
  | ((this: unknown, key: string, value: unknown) => unknown)
  | (number | string)[]
  | null;

type ParseFunction = (text: string, reviver?: Reviver) => unknown;
type StringifyFunction = (
  value: unknown,
  replacer?: Replacer,
  space?: number,
) => string;

interface IJson {
  parse: ParseFunction;
  stringify: StringifyFunction;
}

const _isObject = (
  value: unknown,
): value is Record<string | number | symbol, unknown> =>
  typeof value === 'object' && value !== null;

const _revive = (key: string, value: unknown, reviver?: Reviver) => {
  if (typeof value === 'string' && /^\d+(\.\d+)?n$/u.test(value)) {
    const convertedValue = BigInt(value.slice(0, -1));

    return reviver?.(key, convertedValue) ?? convertedValue;
  }

  return reviver?.(key, value) ?? value;
};

const _toJSON = <T>(value: T): T => {
  const ancestors: unknown[] = [];

  const convert = (value: unknown, ancestor?: unknown): unknown => {
    if (typeof value === 'bigint') return `${value}n`;

    if (!_isObject(value)) return value;

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

    if (value instanceof Map) {
      return [...value.keys()].reduce(
        (acc, key) => ({ ...acc, [key]: convert(value.get(key), value) }),
        {},
      );
    }

    if (value instanceof Set) {
      return [...value].map((item) => convert(item, value));
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
};

const _parse: ParseFunction = (text, reviver) => {
  return JSON.parse(text, (key, value) => _revive(key, value, reviver));
};

const _stringify: StringifyFunction = (value, replacer, space = 4) => {
  return JSON.stringify(_toJSON(value), replacer as OverriddenReplacer, space);
};

const Json = Object.defineProperties({} as IJson, {
  parse: {
    value: _parse,
    enumerable: false,
    writable: false,
  },
  stringify: {
    value: _stringify,
    enumerable: false,
    writable: false,
  },
});

export { Json };
export default Json;
