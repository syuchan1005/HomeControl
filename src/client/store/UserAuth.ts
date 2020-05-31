import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  accessToken?: string;
  refreshToken?: string;
  expiredAt?: number;
} = {
  accessToken: undefined,
  refreshToken: undefined,
  expiredAt: undefined,
};

const slice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setToken: (state, { payload: { accessToken, refreshToken, expiredAt } }) => ({
      ...state,
      accessToken,
      refreshToken,
      expiredAt: new Date(expiredAt).getTime(),
    }),
    clearToken: () => initialState,
  },
});

export default slice.reducer;

export const { name } = slice;

export const { setToken, clearToken } = slice.actions;

export const getLoggedInSelector = (
  state: { [slice.name]: typeof initialState },
) => {
  const { accessToken, refreshToken, expiredAt } = state.userAuth;
  return accessToken && accessToken.length > 0
    && refreshToken && refreshToken.length > 0
    && expiredAt && expiredAt > Date.now();
};
