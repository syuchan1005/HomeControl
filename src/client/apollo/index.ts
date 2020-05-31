import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, NormalizedCacheObject, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { CachePersistor } from 'apollo-cache-persist';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import introspectionQueryResultData from '@common/fragmentTypes.json';

const uri = `//${window.location.hostname}:${window.location.port}/graphql`;

const parseHeaders = (rawHeaders: any) => {
  const headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
    const parts = line.split(':');
    const key = parts.shift().trim();
    if (key) {
      const value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
};

const uploadFetch = (url: string, options: any) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const opts: any = {
      status: xhr.status,
      statusText: xhr.statusText,
      headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
    };
    opts.url = 'responseURL' in xhr
      ? xhr.responseURL
      : opts.headers.get('X-Request-URL');
    const body = 'response' in xhr ? xhr.response : (xhr as any).responseText;
    resolve(new Response(body, opts));
  };
  xhr.onerror = () => {
    reject(new TypeError('Network request failed'));
  };
  xhr.ontimeout = () => {
    reject(new TypeError('Network request timeout'));
  };
  xhr.open(options.method, url, true);

  Object.keys(options.headers).forEach((key) => {
    xhr.setRequestHeader(key, options.headers[key]);
  });

  if (xhr.upload) {
    xhr.upload.onprogress = options.onProgress;
  }

  options.onAbortPossible(() => {
    xhr.abort();
  });

  xhr.send(options.body);
});

const customFetch = (uri1: any, options: any) => {
  if (options.useUpload) {
    return uploadFetch(uri1, options);
  }
  return fetch(uri1, options);
};

const getClient = async (
  createToken: (
    client: ApolloClient<NormalizedCacheObject>,
  ) => Promise<string | undefined> = (() => Promise.resolve(undefined)),
): Promise<[ApolloClient<NormalizedCacheObject>, CachePersistor<NormalizedCacheObject>]> => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  const cache = new InMemoryCache({
    fragmentMatcher,
    freezeResults: false,
  });

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        const log = (message) => {
          // @ts-ignore
          if (apolloClient.snackbar) apolloClient.snackbar(message, { variant: 'error' });
          // eslint-disable-next-line
          console.log(message);
        };
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ));
        }
        if (networkError) log(`[Network error]: ${networkError.message}`);
      }),
      setContext(async (operation, prevContext) => {
        const token = await createToken(apolloClient);
        return {
          ...prevContext,
          headers: {
            ...prevContext?.headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      }),
      ApolloLink.split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition'
            && definition.operation === 'subscription'
          );
        },
        new WebSocketLink(new SubscriptionClient(
          `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}${uri}`,
          {
            lazy: true,
            reconnect: true,
          },
        )),
        createUploadLink({
          uri: `${window.location.protocol}${uri}`,
          // credentials: "same-origin",
          fetch: customFetch as any,
        }),
      ),
    ]),
    cache,
    connectToDevTools: process.env.NODE_ENV !== 'production',
  });

  const cachePersistor = new CachePersistor({
    cache,
    storage: window.localStorage,
  });

  return [apolloClient, cachePersistor];
};

export default getClient;
