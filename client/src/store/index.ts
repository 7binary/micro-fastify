import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { AsyncThunk, AsyncThunkPayloadCreator, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as _useSelector } from 'react-redux';
import thunk from 'redux-thunk';

import { RootState, rootReducer } from './root-reducer';
import { Http } from '@/network';

const persistConfig = {
  timeout: 0,
  key: 'root',
  storage,
};
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

const rehydrationCallback = () => {
  const token = store.getState().auth.token;
  token ? Http.setToken(token) : Http.unsetToken();
};
const persistor = persistStore(store, null, rehydrationCallback);

// exports
export * from './root-reducer';
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;
export { store, persistor };

// hints for getState/dispatch @ createAsyncThunk
declare module '@reduxjs/toolkit' {
  type AsyncThunkConfig = {
    state?: unknown;
    dispatch?: AppDispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
  };

  function createAsyncThunk<Returned,
    ThunkArg = void,
    ThunkApiConfig extends AsyncThunkConfig = {state: RootState}>(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<Returned,
      ThunkArg,
      ThunkApiConfig>,
    options?: any,
  ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;
}
