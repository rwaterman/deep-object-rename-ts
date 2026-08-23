import { isPlainObject } from './is_plain_object.mts';
import { SkipRename } from './constants.mts';

export type DeepRenameValue = string | number | null | boolean | undefined;
export type DeepRenameValueFn = (val: DeepRenameValue) => DeepRenameValue | symbol;

export function renameValues<T, U = T>(obj: T, renameValueFn: DeepRenameValueFn): U {
  if (!isPlainObject(obj)) {
    const renameValResult = renameValueFn(obj as DeepRenameValue);
    return (renameValResult === SkipRename ? obj : renameValResult) as U;
  }

  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, renameValues(value, renameValueFn)])) as U;
}
