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
  foo: 123,
  bar: 'qwe',
  error: new Error('Some error'),
  baz: {
    nestedError: new Error('Another error'),
  },
};

object.qux = object;

console.log(Json.stringify(object));

/*
 * Output: "{
 *     "foo": 123,
 *     "bar": "qwe",
 *     "error": {
 *         "stack": "Error: Some error …",
 *         "message": "Some error"
 *     },
 *     "baz": {
 *         "nestedError": {
 *             "stack": "Error: Another error …",
 *             "message": "Another error"
 *         }
 *     },
 *     "qux": "[Circular]"
 * }"
 *
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
    '    "foo": 123,',
    '    "bar": "qwe",',
    '    "error": {',
    '       "stack": "Error: Some error …",',
    '       "message": "Some error"',
    '    },',
    '    "baz": {',
    '        "nestedError": {',
    '           "stack": "Error: Another error …",',
    '           "message": "Another error"',
    '        }',
    '    },',
    '    "qux": "[Circular]"',
    '}'
].join('');

console.log(Json.parse(text));

/*
 * Output: {
 *     foo: 123,
 *     bar: 'qwe',
 *     error: {
 *         stack: 'Error: Some error …',
 *         message: 'Some error'
 *     },
 *     baz: {
 *         nestedError: {
 *             stack: 'Error: Another error …',
 *             message: 'Another error"'
 *         },
 *     },
 *     qux: "[Circular]"
 * }
 *
```
