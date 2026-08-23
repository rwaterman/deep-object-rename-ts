import { isPlainObject } from './is_plain_object.mts';

export type Primitive = string | number | bigint | boolean | symbol | null | undefined;

export function isPrimitive(value: unknown): value is Primitive {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

export interface Visitor {
  key: (key: string) => string | symbol;
  leaf: (value: unknown) => unknown;
}

export function traverse(input: unknown, visitor: Visitor, seen = new WeakMap<object, unknown>()): unknown {
  if (Array.isArray(input)) {
    if (seen.has(input)) return seen.get(input);
    const out: unknown[] = [];
    seen.set(input, out);
    for (const item of input) out.push(traverse(item, visitor, seen));
    return out;
  }

  if (isPlainObject(input)) {
    if (seen.has(input)) return seen.get(input);
    const out: Record<PropertyKey, unknown> = {};
    seen.set(input, out);
    for (const [key, value] of Object.entries(input)) {
      Object.defineProperty(out, visitor.key(key), {
        value: traverse(value, visitor, seen),
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return out;
  }

  return visitor.leaf(input);
}
