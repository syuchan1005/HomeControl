import React, { FC, useState } from 'react';
import {
  makeStyles,
  createStyles,
  Paper,
  Theme,
  Typography, Grid,
} from '@material-ui/core';

import {
  SensorDataQuery as SensorDataQueryData,
  SensorDataQueryVariables,
  SensorDataSubscriptionSubscription,
  SensorDataSubscriptionSubscriptionVariables,
} from '@common/GQLTypes';

import SensorData from '@client/queries/SensorData.gql';
import SensorDataSubscription from '@client/queries/SensorDataSubscription.gql';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import SensorDataLineChart from '@client/components/SensorDataLineChart';

interface SensorChartWidgetProps {
  sensorName: string;
  sensorType: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    marginLeft: theme.spacing(1),
  },
  subTitle: {
    marginLeft: theme.spacing(1),
  },
}));

const SensorChartWidget: FC<SensorChartWidgetProps> = (props: SensorChartWidgetProps) => {
  const classes = useStyles(props);
  const {
    sensorName,
    sensorType,
  } = props;

  const [sensorData, setSensorData] = useState([]);

  useQuery<SensorDataQueryData, SensorDataQueryVariables>(SensorData, {
    variables: {
      sensorName,
      dataType: sensorType,
    },
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setSensorData(data.sensorData);
    },
  });

  useSubscription<SensorDataSubscriptionSubscription,
    SensorDataSubscriptionSubscriptionVariables>(SensorDataSubscription, {
      variables: {
        sensorName,
        dataType: sensorType,
      },
      onSubscriptionData({ subscriptionData }) {
        if (!subscriptionData.loading) {
          if (subscriptionData.error) console.error(subscriptionData.error);
          else {
            const list = [...sensorData, subscriptionData.data.sensorData];
            if (list.length > 20) list.shift();
            setSensorData(list);
          }
        }
      },
    });

  return (
    <Grid item lg={4} md={6} sm={6} xs={12}>
      <Typography className={classes.title} variant="h6">
        {`${sensorType[0].toUpperCase()}${sensorType.substring(1)}`}
        <Typography
          className={classes.subTitle}
          component="span"
          variant="body1"
        >
          {`from ${sensorName}`}
        </Typography>
      </Typography>
      <Paper style={{ width: '100%', height: '300px' }}>
        <SensorDataLineChart data={sensorData} />
      </Paper>
    </Grid>
  );
};

export default SensorChartWidget;
