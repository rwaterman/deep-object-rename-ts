import { beforeEach, describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { renameKeys } from './rename_keys.mts';
import { SkipRename } from './constants.mts';

describe(renameKeys.name, () => {
  let obj: unknown;

  beforeEach(() => {
    obj = { x: { y: { z: 123 } } };
  });

  describe("renames an object's keys deeply", () => {
    it('one level deep', () => {
      const changed = renameKeys(obj, (key) => (key.startsWith('x') ? 'x_changed' : SkipRename));
      assert.deepEqual(changed, { x_changed: { y: { z: 123 } } });
    });

    it('two levels deep', () => {
      const changed = renameKeys(obj, (key) => (key.startsWith('y') ? 'y_changed' : SkipRename));
      assert.deepEqual(changed, { x: { y_changed: { z: 123 } } });
    });

    it('three levels deep', () => {
      const changed = renameKeys(obj, (key) => (key.startsWith('z') ? 'z_changed' : SkipRename));
      assert.deepEqual(changed, { x: { y: { z_changed: 123 } } });
    });
  });

  describe('does not rename an object keys', () => {
    it('if the callback returns SkipRename', () => {
      const changed = renameKeys(obj, (key) => (key.startsWith('a') ? 'a_changed' : SkipRename));
      assert.deepEqual(changed, { x: { y: { z: 123 } } });
    });
  });

  it('returns non-object input unchanged', () => {
    assert.equal(
      renameKeys(123, () => 'x'),
      123,
    );
    assert.equal(
      renameKeys(null, () => 'x'),
      null,
    );
    assert.deepEqual(
      renameKeys([1, 2], () => 'x'),
      [1, 2],
    );
  });
});
