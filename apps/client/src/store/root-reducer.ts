import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { combineReducers } from '@reduxjs/toolkit';

import { authReducer, authActions } from './auth-slice';

export * from './auth-slice';

export const rootReducer = combineReducers({
  auth: authReducer,
});

export const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => bindActionCreators({
    ...authActions,
  }, dispatch), [dispatch]);
};

export type RootState = ReturnType<typeof rootReducer>;
