import { useMemo, useState } from 'react';

type ValidateResult = [string | { [key: string]: string | undefined } | undefined, boolean];
type ValidateFunc<T> = (v: T) => ValidateResult;

export const ValidateOperations: { [key: string]: () => ValidateFunc<any> } = {
  required: <T>(): ValidateFunc<T> => (v: T) => (v ? [undefined, false] : ['Required', true]),
  objectRequired: <T = { [key: string]: any }>(): ValidateFunc<T> => (v: T) => {
    let hasError = false;
    const eObj = Object.entries(v)
      .reduce((obj, [key, value]) => {
        hasError = hasError || !value;
        return {
          ...obj,
          [key]: (value ? undefined : 'Required'),
        };
      }, {});
    return [eObj, hasError];
  },
};

// eslint-disable-next-line import/prefer-default-export
export const useValidationState = <T>(
  initVal: T,
  validationList: Array<ValidateFunc<T>>,
  enableError: boolean | undefined = true,
): [T, (v: T) => void, ValidateResult[0], boolean] => {
  const [value, setValue] = useState<T>(initVal);

  const [error, hasError] = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const validationFunc of validationList) {
      const [tmpError, tmpHasError] = validationFunc(value);
      if (tmpHasError) {
        if (enableError) return [tmpError, true];
        return [undefined, true];
      }
    }
    return [undefined, false];
  }, [value, validationList, enableError]);

  return [value, setValue, error, hasError];
};
