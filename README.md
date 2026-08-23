# @rwaterman/deep-object-rename

Zero-dependency helper to deeply rename either (1) object keys or (2) object values.

ESM only. Requires Node.js 24+.

```sh
npm install @rwaterman/deep-object-rename
```

## renameKeys

Pass a function that returns the new key, or the `SkipRename` symbol to leave it as is.

```ts
import { renameKeys, SkipRename } from '@rwaterman/deep-object-rename';

const obj = { x: { y: { z: 123 } } };

const changed = renameKeys(obj, (key) => (key.startsWith('y') ? 'y_changed' : SkipRename));
// { x: { y_changed: { z: 123 } } }
```

## renameValues

Pass a function that returns the new value, or the `SkipRename` symbol to leave it as is. Only primitive values (`string | number | boolean | null | undefined`, see `DeepRenameValue`) are passed to the callback; nested objects are traversed, arrays are returned untouched.

```ts
import { renameValues, SkipRename, type DeepRenameValue } from '@rwaterman/deep-object-rename';

const obj = { x: { y: { y: 123, z: '123' }, x2: '123' } };

const changed = renameValues(obj, (val: DeepRenameValue) => (val === '123' ? 123 : SkipRename));
// { x: { y: { y: 123, z: 123 }, x2: 123 } }
```

## Development

```sh
npm test        # node:test
npm run lint    # eslint
npm run build   # tsc -> lib/*.mjs
```
