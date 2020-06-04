export const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(arr[i], i, arr);
  }
};

export const asyncMap = async <T, E>(
  arr: Array<E>,
  transform: (e: E, index: number, arr: Array<E>) => Promise<T>,
  reversed = false,
): Promise<T[]> => {
  const result = [];
  if (reversed) {
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      // eslint-disable-next-line no-await-in-loop
      result[i] = await transform(arr[i], i, arr);
    }
  } else {
    for (let i = 0; i < arr.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      result[i] = await transform(arr[i], i, arr);
    }
  }
  return result;
};
