import { SkipRename } from './constants.mts';
import { isPrimitive, traverse } from './traverse.mts';

export type DeepRenameValue = string | number | null | boolean | undefined;
export type DeepRenameValueFn = (val: DeepRenameValue) => DeepRenameValue | symbol;

export function renameValues<T, U = T>(obj: T, renameValueFn: DeepRenameValueFn): U {
  return traverse(obj, {
    key: (key) => key,
    leaf: (value) => {
      if (!isPrimitive(value)) return value;
      const result = renameValueFn(value as DeepRenameValue);
      return result === SkipRename ? value : result;
    },
  }) as U;
}
