import { useEffect, useMemo, useState } from 'react';

type ValidateFunc<T> = (v: T) => string | undefined;

export const ValidateOperations: { [key: string]: () => ValidateFunc<any> } = {
  required: <T>(): ValidateFunc<T> => (v: T) => (v ? undefined : 'Required'),
};

// eslint-disable-next-line import/prefer-default-export
export const useValidationState = <T>(
  initVal: T,
  validationList: Array<ValidateFunc<T>>,
  enableError: boolean | undefined = true,
): [T, (v: T) => void, string | undefined, boolean] => {
  const [value, setValue] = useState<T>(initVal);

  useEffect(() => () => {
    setValue(initVal);
  }, [setValue, initVal]);

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
