import Vue from 'vue';
import VueApollo from 'vue-apollo';

import { localOAuthClient } from '../Config';

// eslint-disable-next-line
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';

// Install the vue plugin
Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token';

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP
  || (window.location.hostname === 'localhost' ? 'http://localhost:8080/graphql' : `https://${window.location.hostname}/graphql`);
// Files URL root
export const filesRoot = process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'));

Vue.prototype.$filesRoot = filesRoot;

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  // wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: myLink

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  // getAuth: (tokenName) =>
  getAuth: () => (window.sessionStorage.getItem('AccessToken')
    ? `Bearer ${window.sessionStorage.getItem('AccessToken')}`
    : undefined),

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
};

// Call this in the Vue app file
export function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  });
  apolloClient.wsClient = wsClient;

  // Create vue apollo provider
  return new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
  });
}

let refreshTimeout = -1;
export const refreshToken = () => {
  clearTimeout(refreshTimeout);
  return Vue.prototype.$http({
    url: '/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: Object.entries({
      client_id: localOAuthClient.id,
      client_secret: localOAuthClient.secret,
      grant_type: 'refresh_token',
      refresh_token: window.sessionStorage.getItem('RefreshToken'),
    }).reduce((p, e) => p.append(e[0], e[1]) || p, new URLSearchParams()),
  }).then(({ data }) => {
    // eslint-disable-next-line
    console.log('Token refresh!');
    window.sessionStorage.setItem('AccessToken', data.access_token);
    window.sessionStorage.setItem('RefreshToken', data.refresh_token);
    refreshTimeout = setTimeout(refreshToken, data.expires_in * 1000);
  });
};
