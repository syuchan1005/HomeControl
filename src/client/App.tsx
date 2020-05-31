import React, { FC } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';

import Home from '@client/pages/Home';
import SensorList from '@client/pages/SensorList';
import RemoteControllerList from '@client/pages/RemoteControllerList';
import MainAppBar from '@client/components/MainAppBar';
import { Error } from '@client/pages/Error';
import { GoogleAuth } from '@client/pages/GoogleAuth';

const App: FC = () => (
  <>
    <CssBaseline />
    <BrowserRouter>
      <Switch>
        <Route exact path={['/', '/sensor', '/remote_controller']} component={MainAppBar} />
      </Switch>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/sensor" component={SensorList} />
        <Route exact path="/remote_controller" component={RemoteControllerList} />
        <Route exact path="/google_auth" component={GoogleAuth} />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  </>
);

export default hot(App);
