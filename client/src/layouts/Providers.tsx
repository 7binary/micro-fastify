import { PersistGate } from 'redux-persist/integration/react';
import { PropsWithChildren, useEffect } from 'react';
import { Provider } from 'react-redux';

import { store, persistor, useActions, useSelector, selectToken } from '@/store';

export const Providers = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Provider store={store}>
      <PersistGateSSR>
        <AuthProvider>
          {children}
        </AuthProvider>
      </PersistGateSSR>
    </Provider>
  );
};

const PersistGateSSR = ({ children }: PropsWithChildren<{}>) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  } else {
    return (
      <PersistGate loading={null} persistor={persistor}>
        {() => children}
      </PersistGate>
    );
  }
};

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const { registerHttpRetry, loadUser, setAppLoaded } = useActions();
  const token = useSelector(selectToken);

  useEffect(() => {
    setAppLoaded();
    registerHttpRetry();

    if (token) {
      (async () => {
        loadUser();
      })();
    }
  }, [token]);

  return (<>{children}</>);
};
