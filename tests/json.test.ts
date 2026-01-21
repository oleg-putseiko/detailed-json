import { Json } from '../src';

describe('json', () => {
  it('should stringify and parse string', () => {
    const parsed = 'foo bar';
    const stringified = '"foo bar"';

    expect(Json.stringify(parsed)).toBe(stringified);
    expect(Json.parse(stringified)).toBe(parsed);
  });

  it('should not stringify and parse symbol', () => {
    expect(Json.stringify(Symbol())).toBe(undefined);
  });

  it('should stringify and parse number', () => {
    const parsed = 123;
    const stringified = '123';

    expect(Json.stringify(parsed)).toBe(stringified);
    expect(Json.parse(stringified)).toBe(parsed);
  });

  it('should stringify and parse bigint', () => {
    const parsed = 123n;
    const stringified = '"123n"';

    expect(Json.stringify(parsed)).toBe(stringified);
    expect(Json.parse(stringified)).toBe(parsed);
  });

  it('should stringify Infinity', () => {
    const parsed = Infinity;
    const stringified = 'null';

    expect(Json.stringify(parsed)).toBe(stringified);
  });

  it('should stringify and parse boolean', () => {
    const parsed = true;
    const stringified = 'true';

    expect(Json.stringify(parsed)).toBe(stringified);
    expect(Json.parse(stringified)).toBe(parsed);
  });

  it('should stringify null', () => {
    const parsed = null;
    const stringified = 'null';

    expect(Json.stringify(parsed)).toBe(stringified);
  });

  it('should not stringify and parse undefined', () => {
    expect(Json.stringify(undefined)).toBe(undefined);
  });

  it('should not stringify and parse function', () => {
    expect(Json.stringify(() => {})).toBe(undefined);
  });

  it('should stringify and parse array', () => {
    const parsed = [1, 2, 3];
    const stringified = '[1,2,3]';

    expect(Json.stringify(parsed, undefined, 0)).toBe(stringified);
    expect(Json.parse(stringified)).toEqual(parsed);
  });

  it('should stringify and parse map', () => {
    const parsed = new Map([['key', 'value']]);
    const stringified = '{"key":"value"}';

    expect(Json.stringify(parsed, undefined, 0)).toBe(stringified);
    expect(Json.parse(stringified)).toEqual(Object.fromEntries(parsed));
  });

  it('should stringify and parse set', () => {
    const parsed = new Set([1, 2, 3]);
    const stringified = '[1,2,3]';

    expect(Json.stringify(parsed, undefined, 0)).toBe(stringified);
    expect(Json.parse(stringified)).toEqual(Array.from(parsed));
  });

  it('should stringify date', () => {
    const parsed = new Date('2026-01-01T00:00:00.000Z');
    const stringified = '"2026-01-01T00:00:00.000Z"';

    expect(Json.stringify(parsed)).toBe(stringified);
  });

  it('should stringify and parse object with own props', () => {
    const parsed = { null: null, enumerable: 'foo' };
    Object.defineProperty(parsed, 'nonEnumerable', {
      value: 'bar',
      enumerable: false,
    });

    const stringified =
      '{"null":null,"enumerable":"foo","nonEnumerable":"bar"}';

    expect(Json.stringify(parsed, undefined, 0)).toBe(stringified);
    expect(Json.parse(stringified)).toEqual({
      ...parsed,
      nonEnumerable: 'bar',
    });
  });

  it('should stringify object with circular ref', () => {
    const parsed = { ref: {} };
    parsed.ref = parsed;

    const stringified = '{"ref":"[Circular]"}';

    expect(Json.stringify(parsed, undefined, 0)).toBe(stringified);
    expect(Json.parse(stringified)).toEqual({ ref: '[Circular]' });
  });
});
