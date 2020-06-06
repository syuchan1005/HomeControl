import React, { FC } from 'react';
import {
  Grid,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
// import SensorChartWidget from '@client/components/SensorChartWidget';
import { useQuery } from '@apollo/react-hooks';

import { SensorsQuery as SensorsQueryData, SensorsQueryVariables } from '@common/GQLTypes';

import SensorsQuery from '@client/queries/Sensors.gql';

const SensorChartWidget = React.lazy(() => import(/* webpackChunkName: "SensorChartWidget" */ '@client/components/SensorChartWidget'));

const useStyles = makeStyles((theme: Theme) => createStyles({
  main: {
    margin: theme.spacing(1),
  },
}));

const Home: FC = () => {
  const classes = useStyles();

  const { data } = useQuery<SensorsQueryData, SensorsQueryVariables>(SensorsQuery);

  return (
    <main className={classes.main}>
      <Grid container spacing={1}>
        {(data && data.sensors) && data.sensors.map((sensor) => sensor.dataType
          .map((dataType) => (
            <SensorChartWidget
              key={`${sensor.name}.${dataType}`}
              sensorName={sensor.name}
              sensorType={dataType}
            />
          )))}
      </Grid>
    </main>
  );
};

export default Home;
