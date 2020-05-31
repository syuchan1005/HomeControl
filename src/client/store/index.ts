import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userAuthReducer, { name as userAuthName } from './UserAuth';

const reducer = combineReducers({
  [userAuthName]: userAuthReducer,
});

const persistConfig = {
  key: 'redux',
  storage,
  whitelist: ['userAuth'],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);

export default store;
