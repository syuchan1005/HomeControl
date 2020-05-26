import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';

import getClient from '@client/apollo/index';
import regSW from './registerServiceWorker';
import App from './App';

regSW();

(async () => {
  const [client] = await getClient();

  ReactDOM.render(
    (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    ),
    document.getElementById('app'),
  );
})();
