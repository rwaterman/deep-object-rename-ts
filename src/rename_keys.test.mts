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

describe('renameKeys edge cases', () => {
  const upper = (key: string) => key.toUpperCase();

  it('passes Date, Map, Set, RegExp, Buffer and class instances through untouched', () => {
    class Point {
      x = 1;
    }
    const input = {
      d: new Date(0),
      m: new Map([[1, 2]]),
      s: new Set([1]),
      r: /x/,
      b: Buffer.from('hi'),
      p: new Point(),
    };
    const out = renameKeys<typeof input, Record<string, unknown>>(input, upper);
    assert.equal(out.D, input.d);
    assert.equal(out.M, input.m);
    assert.equal(out.S, input.s);
    assert.equal(out.R, input.r);
    assert.equal(out.B, input.b);
    assert.equal(out.P, input.p);
  });

  it('traverses null-prototype objects', () => {
    const inner: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
    inner.a = 1;
    assert.deepEqual(renameKeys({ inner }, upper), { INNER: { A: 1 } });
  });

  it('renames objects nested inside arrays', () => {
    assert.deepEqual(renameKeys({ list: [{ a: 1 }, [{ b: 2 }]] }, upper), { LIST: [{ A: 1 }, [{ B: 2 }]] });
  });

  it('does not pollute Object.prototype when a key is renamed to __proto__', () => {
    renameKeys({ a: { polluted: true } }, () => '__proto__');
    assert.equal(({} as Record<string, unknown>).polluted, undefined);
  });

  it('does not pollute Object.prototype from an own __proto__ key in parsed JSON', () => {
    renameKeys(JSON.parse('{"__proto__":{"polluted":true}}'), () => SkipRename);
    assert.equal(({} as Record<string, unknown>).polluted, undefined);
  });

  it('preserves circular and shared references instead of overflowing the stack', () => {
    const shared = { a: 1 };
    const input: Record<string, unknown> = { x: shared, y: shared };
    input.self = input;
    const out = renameKeys<typeof input, Record<string, unknown>>(input, upper);
    assert.equal(out.SELF, out);
    assert.equal(out.X, out.Y);
    assert.deepEqual(out.X, { A: 1 });
  });

  it('renames a top-level array of objects', () => {
    assert.deepEqual(renameKeys([{ a: 1 }], upper), [{ A: 1 }]);
  });
});
