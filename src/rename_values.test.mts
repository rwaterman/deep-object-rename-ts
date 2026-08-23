import { beforeEach, describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { type DeepRenameValue, renameValues } from './rename_values.mts';
import { SkipRename } from './constants.mts';

function fixture() {
  return {
    x1: { y: 123, y2: '123', z: true, z2: false, z3: null, z4: undefined },
    x2: {
      y: { y: 123, y2: '123' },
      z: { z: true, z2: false, z3: { z: { z: null, z2: undefined } } },
    },
  };
}

describe(renameValues.name, () => {
  let obj: ReturnType<typeof fixture>;

  beforeEach(() => {
    obj = fixture();
  });

  describe("renames an object's values deeply for", () => {
    it('a number', () => {
      const changed = renameValues(obj, (val: DeepRenameValue) => (val === 123 ? 321 : SkipRename));
      assert.deepEqual(changed, {
        x1: { y: 321, y2: '123', z: true, z2: false, z3: null, z4: undefined },
        x2: {
          y: { y: 321, y2: '123' },
          z: { z: true, z2: false, z3: { z: { z: null, z2: undefined } } },
        },
      });
    });

    it('a string', () => {
      const changed = renameValues(obj, (val: DeepRenameValue) => (val === '123' ? '321' : SkipRename));
      assert.deepEqual(changed, {
        x1: { y: 123, y2: '321', z: true, z2: false, z3: null, z4: undefined },
        x2: {
          y: { y: 123, y2: '321' },
          z: { z: true, z2: false, z3: { z: { z: null, z2: undefined } } },
        },
      });
    });

    it('a true value', () => {
      const changed = renameValues(obj, (val: DeepRenameValue) => (val === true ? false : SkipRename));
      assert.deepEqual(changed, {
        x1: { y: 123, y2: '123', z: false, z2: false, z3: null, z4: undefined },
        x2: {
          y: { y: 123, y2: '123' },
          z: { z: false, z2: false, z3: { z: { z: null, z2: undefined } } },
        },
      });
    });

    it('a false value', () => {
      const changed = renameValues(obj, (val: DeepRenameValue) => (val === false ? true : SkipRename));
      assert.deepEqual(changed, {
        x1: { y: 123, y2: '123', z: true, z2: true, z3: null, z4: undefined },
        x2: {
          y: { y: 123, y2: '123' },
          z: { z: true, z2: true, z3: { z: { z: null, z2: undefined } } },
        },
      });
    });

    it('a null value', () => {
      const changed = renameValues(obj, (val: DeepRenameValue) => (val === null ? false : SkipRename));
      assert.deepEqual(changed, {
        x1: { y: 123, y2: '123', z: true, z2: false, z3: false, z4: undefined },
        x2: {
          y: { y: 123, y2: '123' },
          z: { z: true, z2: false, z3: { z: { z: false, z2: undefined } } },
        },
      });
    });

    it('an undefined value', () => {
      const changed = renameValues(obj, (val: DeepRenameValue) => (val === undefined ? false : SkipRename));
      assert.deepEqual(changed, {
        x1: { y: 123, y2: '123', z: true, z2: false, z3: null, z4: false },
        x2: {
          y: { y: 123, y2: '123' },
          z: { z: true, z2: false, z3: { z: { z: null, z2: false } } },
        },
      });
    });
  });

  it('does not mutate the input', () => {
    renameValues(obj, () => 0);
    assert.deepEqual(obj, fixture());
  });
});
