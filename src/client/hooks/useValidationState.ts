import { useEffect, useMemo, useState } from 'react';

type ValidateResult = string | { [key: string]: string | undefined } | undefined;
type ValidateFunc<T> = (v: T) => ValidateResult;

export const ValidateOperations: { [key: string]: () => ValidateFunc<any> } = {
  required: <T>(): ValidateFunc<T> => (v: T) => (v ? undefined : 'Required'),
  objectRequired: <T = { [key: string]: any }>(): ValidateFunc<T> => (v: T) => Object.entries(v)
    .reduce((obj, [key, value]) => ({
      ...obj,
      [key]: (value ? undefined : 'Required'),
    }), {}),
};

// eslint-disable-next-line import/prefer-default-export
export const useValidationState = <T>(
  initVal: T,
  validationList: Array<ValidateFunc<T>>,
  enableError: boolean | undefined = true,
): [T, (v: T) => void, ValidateResult, boolean] => {
  const [value, setValue] = useState<T>(initVal);

  const [error, hasError] = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const validationFunc of validationList) {
      const s = validationFunc(value);
      if (s) {
        if (enableError) return [s, true];
        return [undefined, true];
      }
    }
    return [undefined, false];
  }, [value, validationList, enableError]);

  return [value, setValue, error, hasError];
};
