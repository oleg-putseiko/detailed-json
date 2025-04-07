<div align="center">

# detailed-json

[![Latest Release](https://badgen.net/github/release/oleg-putseiko/detailed-json?icon=github&cache=240)](https://github.com/oleg-putseiko/detailed-json/releases)
[![Total Downloads](https://badgen.net/npm/dt/detailed-json?icon=npm&cache=240)](https://www.npmjs.com/package/detailed-json)
[![Install Size](https://badgen.net/packagephobia/install/detailed-json?color=purple&cache=240)](https://www.npmjs.com/package/detailed-json)
[![License](https://badgen.net/npm/license/detailed-json?color=black&cache=240)](https://github.com/oleg-putseiko/detailed-json/blob/main/LICENSE.md)

</div>

Provides a type-safe and circularly-safe API for working with detailed JSON.

## Advantages

✨ Stringification of values without losing the objects' own properties

✨ JSON circular structure detection

✨ Compatibility with native JSON API

✨ Type-safe API

## Installation

```bash
npm install detailed-json

# or
pnpm install detailed-json

# or
yarn add detailed-json
```

## API

### stringify

Type: `(value: unknown, replacer?: Replacer, space?: number) => string`

Converts a JavaScript value to a JavaScript Object Notation (JSON) string.

#### Options

- `value` — A JavaScript value, usually an object or array, to be converted.
- `replacer` — An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified. _(Optional, default value - `undefined`)_
- `space` — Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read. _(Optional, default value - `4`)_

#### Example

```js
import { Json } from 'detailed-json';

const object = {
  string: 'foo bar',
  number: 123,
  bigint: 123n,
  infinity: Infinity,
  boolean: true,
  null: null,
  undefined: undefined,
  symbol: Symbol('description'),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  array: [1, 2, 3],
  date: new Date(),
  error: new Error('Some error'),
  function: function func() {},
  object: {
    error: new Error('Nested error'),
  },
};

object.circularRef = object;

console.log(Json.stringify(object));

/*
 * Output:
 * {
 *     "string": "foo bar",
 *     "number": 123,
 *     "bigint": "123n",
 *     "infinity": null,
 *     "boolean": true,
 *     "null": null,
 *     "map": {
 *         "key": "value"
 *     },
 *     "set": [
 *         1,
 *         2,
 *         3
 *     ],
 *     "array": [
 *         1,
 *         2,
 *         3
 *     ],
 *     "date": "2025-04-06T15:59:01.374Z",
 *     "error": {
 *         "stack": "Error: Some error …",
 *         "message": "Some error"
 *     },
 *     "object": {
 *         "error": {
 *             "stack": "Error: Nested error …",
 *             "message": "Nested error"
 *         }
 *     },
 *     "circularRef": "[Circular]"
 * }
 */
```

### parse

Type: `(text: string, reviver?: Reviver) => unknown`

Converts a JavaScript Object Notation (JSON) string into an object.

#### Options

- `text` — A valid JSON string.
- `reviver` — A function that transforms the results. This function is called for each member of the object. If a member contains nested objects, the nested objects are transformed before the parent object is. _(Optional, default value - `undefined`)_

#### Example

```js
import { Json } from 'detailed-json';

const text = [
  '{',
  '    "string": "foo bar",',
  '    "number": 123,',
  '    "bigint": "123n",',
  '    "infinity": null,',
  '    "boolean": true,',
  '    "null": null,',
  '    "array": [',
  '        1,',
  '        2,',
  '        3',
  '    ],',
  '    "date": "2025-04-06T15:59:01.374Z",',
  '    "error": {',
  '        "stack": "Error: Some error …",',
  '        "message": "Some error"',
  '    },',
  '    "object": {',
  '        "error": {',
  '            "stack": "Error: Nested error …",',
  '            "message": "Nested error"',
  '        }',
  '    },',
  '    "circularRef": "[Circular]"',
  '}',
].join('');

console.log(Json.parse(text));

/*
 * Output:
 * {
 *     string: 'foo bar',
 *     number: 123,
 *     bigint: 123n,
 *     infinity: null,
 *     boolean: true,
 *     null: null,
 *     array: [ 1, 2, 3 ],
 *     date: '2025-04-06T15:59:01.374Z', // Date object
 *     error: {
 *        stack: 'Error: Some error …',
 *        message: 'Some error'
 *     },
 *     object: {
 *         error: {
 *             stack: 'Error: Nested error …',
 *             message: 'Nested error'
 *         }
 *     },
 *     circularRef: '[Circular]'
 * }
 */
```
