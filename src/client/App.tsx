import React, { FC, useCallback } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
} from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { hot } from 'react-hot-loader/root';

import {
  HelloQuery as HelloQueryData,
  HelloQueryVariables,
} from '@common/GQLTypes';
import HelloQuery from '@client/graphqls/hello.gql';

import About from '@client/pages/About';
import Home from '@client/pages/Home';

const App: FC = () => {
  const {
    data,
    loading,
    refetch,
  } = useQuery<HelloQueryData, HelloQueryVariables>(HelloQuery);

  const clickRefetch = useCallback(() => refetch(), [refetch]);

  return (
    <main>
      <div>{(!loading && data) ? data.hello : 'loading'}</div>
      <button type="button" onClick={clickRefetch}>Refetch</button>

      <BrowserRouter>
        <div>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
        </Switch>
      </BrowserRouter>
    </main>
  );
};

export default hot(App);
