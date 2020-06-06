import React, { FC } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';

const MainAppBar = React.lazy(() => import(/* webpackChunkName: "MainAppBar" */ '@client/components/MainAppBar'));
const Home = React.lazy(() => import(/* webpackChunkName: "Home" */ '@client/pages/Home'));
const SensorList = React.lazy(() => import(/* webpackChunkName: "SensorList" */ '@client/pages/SensorList'));
const RemoteControllerList = React.lazy(() => import(/* webpackChunkName: "RemoteControllerList" */ '@client/pages/RemoteControllerList'));
const DeviceList = React.lazy(() => import(/* webpackChunkName: "DeviceList" */ '@client/pages/DeviceList'));
const Error = React.lazy(() => import(/* webpackChunkName: "Error" */ '@client/pages/Error'));
const GoogleAuth = React.lazy(() => import(/* webpackChunkName: "GoogleAuth" */'@client/pages/GoogleAuth'));

const App: FC = () => (
  <>
    <CssBaseline />
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={[
            '/',
            '/sensor',
            '/remote_controller',
            '/device',
          ]}
          component={MainAppBar}
        />
      </Switch>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/sensor" component={SensorList} />
        <Route exact path="/remote_controller" component={RemoteControllerList} />
        <Route exact path="/device" component={DeviceList} />
        <Route exact path="/google_auth" component={GoogleAuth} />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  </>
);

export default hot(App);
