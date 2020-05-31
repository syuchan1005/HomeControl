import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import getClient from '@client/apollo/index';
import store, { persistor } from '@client/store';

import regSW from '@client/registerServiceWorker';
import App from '@client/App';

regSW();

(async () => {
  const [client] = await getClient(
    async () => {
      const { userAuth: auth } = store.getState();
      if (!auth || !auth.accessToken) return undefined;
      const sub = auth.expiredAt - Date.now();
      if (sub > 0) {
        // if (sub < /* 5minutes */ 5 * 60 * 1000) {
        //   const { data } = await c.mutate<RefreshTokenMutationData,
        //     RefreshTokenMutationVariables>({
        //     mutation: RefreshTokenMutation,
        //     variables: { token: auth.refreshToken },
        //   });
        //   if (data && data.refreshToken.success) {
        //     store.dispatch(authModule.actions.set(data.refreshToken.token));
        //     return data.refreshToken.token.accessToken;
        //   }
        // }
        return auth.accessToken;
      }
      return undefined;
    },
  );

  ReactDOM.render(
    (
      <ReduxProvider store={store}>
        <PersistGate persistor={persistor}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </PersistGate>
      </ReduxProvider>
    ),
    document.getElementById('app'),
  );
})();
