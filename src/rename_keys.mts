import { SkipRename } from './constants.mts';
import { traverse } from './traverse.mts';

export type DeepRenameKeyFn = (key: string) => string | symbol;

export function renameKeys<T, U = T>(obj: T, renameKeyFn: DeepRenameKeyFn): U {
  return traverse(obj, {
    key: (key) => {
      const result = renameKeyFn(key);
      return result === SkipRename ? key : result;
    },
    leaf: (value) => value,
  }) as U;
}
