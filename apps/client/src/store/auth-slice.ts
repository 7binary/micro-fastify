import {
  createSlice,
  createSelector,
  PayloadAction,
  Reducer,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { persistReducer, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { User } from '@/types';
import { Http, authHttp, AuthResponse } from '@/network';

// INTERFACE
export interface AuthState {
  appIsLoaded: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  appIsLoaded: false,
  user: null,
  token: null,
};

// ASYNC THUNK
const loadUser = createAsyncThunk('auth/getProfile', async (): Promise<User | null> => {
  return await authHttp.loadUser();
});
const setAuthAsync = createAsyncThunk('auth/setAuthAsync',
  async (authResponse: AuthResponse) => authResponse,
);
const unsetAuthAsync = createAsyncThunk('auth/unsetAuthAsync',
  async () => null,
);

// HTTP RETRY
let httpRetryRegistered = false;
const registerHttpRetry = createAsyncThunk('auth/registry-http-retry', async (_, { dispatch }) => {
  if (httpRetryRegistered) {
    return;
  }
  Http.setOnError((axiosInstance: AxiosInstance) => async (error) => {
    if (error.response?.status === 401 && error.config && !error.config.__isRetry) {
      error.config.__isRetry = true;
      try {
        const authResponse = await authHttp.refresh();
        dispatch(setAuthAsync(authResponse));
        error.config.headers.Authorization = `Bearer ${authResponse.accessToken}`;

        return axiosInstance.request(error.config);
      } catch (refreshError: any) {
        if (refreshError.response?.status === 401) {
          dispatch(unsetAuthAsync());
        } else {
          console.error(refreshError);
        }
      }
    }
    throw error;
  });
  httpRetryRegistered = true;
});

// SLICE
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: () => {
      Http.unsetToken();

      return initialState;
    },
    setAuthResponse: (state, action: PayloadAction<AuthResponse>) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      Http.setToken(accessToken);
    },
    setAppLoaded: (state) => {
      state.appIsLoaded = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled.type, (state, action: PayloadAction<User | null>) => {
        state.user = action.payload;
      })
      .addCase(setAuthAsync.fulfilled.type, (state, action: PayloadAction<AuthResponse>) => {
        const { user, accessToken } = action.payload;
        state.user = user;
        state.token = accessToken;
        Http.setToken(accessToken);
      })
      .addCase(unsetAuthAsync.fulfilled.type, (state) => {
        state.user = null;
        state.token = null;
        Http.unsetToken();
      })
      .addCase(REHYDRATE, (state) => {
        state.appIsLoaded = false;
      });
  },
});

// EXPORTS REDUCER
export const authReducer = persistReducer({
  key: 'auth',
  storage,
  blacklist: ['appIsLoaded'],
}, slice.reducer) as Reducer<typeof initialState & {_persist?: any}>;

// EXPORTS ACTIONS
export const authActions = { ...slice.actions, registerHttpRetry, loadUser };

// EXPORT SELECTORS
const selectSelf = (rootState: {auth: AuthState}) => rootState.auth;
export const selectUser = createSelector(selectSelf, state => state.user);
export const selectLoggedUser = createSelector(selectSelf, state => state.user as User);
export const selectToken = createSelector(selectSelf, state => state.token);
export const selectAppIsLoaded = createSelector(selectSelf, state => state.appIsLoaded);
