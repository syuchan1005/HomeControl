import React, {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Grid,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Add as AddIcon,
  PermDeviceInformation as PermDeviceInformationIcon,
  BarChart as BarChartIcon,
} from '@material-ui/icons';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import { useSelector } from 'react-redux';

import { getLoggedInSelector } from '@client/store/UserAuth';
import UserAuthDialog from '@client/components/UserAuthDialog';
// import SensorChartWidget from '@client/components/SensorChartWidget';
import { useLazyQuery } from '@apollo/react-hooks';

import {
  WidgetsQuery as WidgetsQueryData,
  WidgetsQueryVariables,
} from '@common/GQLTypes';

import Widgets from '@client/queries/Widgets.gql';
import RemoteControllerWidget from '@client/components/RemoteControllerWidget';
import AddSensorWidgetDialog from '@client/components/AddSensorWidgetDialog';
import AddRemoteControllerWidgetDialog from '@client/components/AddRemoteControllerWidgetDialog';

const SensorChartWidget = React.lazy(() => import(/* webpackChunkName: "SensorChartWidget" */ '@client/components/SensorChartWidget'));

enum AddWidgetType {
  Sensor,
  RemoteController,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  fab: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  main: {
    margin: theme.spacing(1),
  },
}));

const Home: FC = () => {
  const classes = useStyles();

  const loggedIn = useSelector(getLoggedInSelector);

  const [showDial, setShowDial] = useState(false);

  const [loadWidgets, { called, data, refetch }] = useLazyQuery<WidgetsQueryData,
    WidgetsQueryVariables>(Widgets);

  useEffect(() => {
    if (loggedIn && !called) {
      loadWidgets();
    }
  }, [loggedIn]);

  const [showAddWidgetDialog, setShowAddWidgetDialog] = useState<AddWidgetType | undefined
    >(undefined);

  const widgetOnClose = useCallback(() => {
    setShowAddWidgetDialog(undefined);
    setShowDial(false);
  }, [setShowAddWidgetDialog, setShowDial]);

  return (
    <>
      {loggedIn && (
        <main className={classes.main}>
          <Grid container spacing={1}>
            {(data) && data.widgets.map((widget) => {
              // eslint-disable-next-line no-underscore-dangle
              switch (widget.__typename) {
                case 'SensorWidget':
                  return (
                    <Suspense
                      key={widget.id}
                      fallback={<div />}
                    >
                      <SensorChartWidget
                        sensorName={widget.name}
                        sensorType={widget.dataType}
                      />
                    </Suspense>
                  );
                case 'RemoteControllerWidget':
                  return (
                    <RemoteControllerWidget
                      key={widget.id}
                      controllerId={widget.controllerId}
                      sendIR
                    />
                  );
                default:
                  return (
                    <div>Unknown</div>
                  );
              }
            })}
          </Grid>
        </main>
      )}

      <UserAuthDialog open={!loggedIn} />

      <AddSensorWidgetDialog
        open={showAddWidgetDialog === AddWidgetType.Sensor}
        onClose={widgetOnClose}
        onAdded={() => {
          widgetOnClose();
          refetch();
        }}
      />

      <AddRemoteControllerWidgetDialog
        open={showAddWidgetDialog === AddWidgetType.RemoteController}
        onClose={widgetOnClose}
        onAdded={() => {
          widgetOnClose();
          refetch();
        }}
      />

      <SpeedDial
        className={classes.fab}
        open={showDial}
        onOpen={() => setShowDial(true)}
        onClose={() => setShowDial(false)}
        icon={<AddIcon />}
        ariaLabel="ADD"
        FabProps={{
          color: 'secondary',
        }}
      >
        <SpeedDialAction
          onClick={() => setShowAddWidgetDialog(AddWidgetType.RemoteController)}
          icon={<PermDeviceInformationIcon />}
          title="Add RemoteController"
        />
        <SpeedDialAction
          onClick={() => setShowAddWidgetDialog(AddWidgetType.Sensor)}
          icon={<BarChartIcon />}
          title="Add Sensor"
        />
      </SpeedDial>
    </>
  );
};

export default Home;
