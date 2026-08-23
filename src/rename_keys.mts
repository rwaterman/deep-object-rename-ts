import { isPlainObject } from './is_plain_object.mts';
import { SkipRename } from './constants.mts';

export type DeepRenameKeyFn = (key: string) => string | symbol;

export function renameKeys<T, U = T>(obj: T, renameKeyFn: DeepRenameKeyFn): U {
  if (!isPlainObject(obj)) {
    return obj as unknown as U;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const renameKeyResult = renameKeyFn(key);
      const keyToUse = renameKeyResult === SkipRename ? key : renameKeyResult;
      return [keyToUse, renameKeys(value, renameKeyFn)];
    }),
  ) as U;
}
