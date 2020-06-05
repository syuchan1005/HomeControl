import React, { FC, useState } from 'react';
import {
  createStyles,
  Fab,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { AddDeviceDialog } from '@client/components/AddDeviceDialog';

import {
  DevicesQuery as DevicesQueryData,
  DevicesQueryVariables,
} from '@common/GQLTypes';
import DevicesQuery from '@client/queries/DevicesQuery.gql';
import { useQuery } from '@apollo/react-hooks';
import { DeviceWidget } from '@client/components/DeviceWidget';

const useStyles = makeStyles((theme: Theme) => createStyles({
  fab: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  empty: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  main: {
    margin: theme.spacing(1),
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const DeviceList: FC = (props) => {
  const classes = useStyles(props);

  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false);

  const {
    data,
    refetch,
  } = useQuery<DevicesQueryData, DevicesQueryVariables>(DevicesQuery);

  return (
    <>
      <main className={classes.main}>
        {!data || ((data.devices.length === 0) ? (
          <div className={classes.empty}>
            <div>Empty</div>
          </div>
        ) : (
          <Grid container spacing={1}>
            {data.devices.map((device) => (
              <DeviceWidget
                key={device.id}
                device={device}
              />
            ))}
          </Grid>
        ))}
      </main>

      <Fab
        color="secondary"
        className={classes.fab}
        onClick={() => setShowAddDeviceDialog(true)}
      >
        <AddIcon />
      </Fab>

      <AddDeviceDialog
        open={showAddDeviceDialog}
        onClose={() => setShowAddDeviceDialog(false)}
        onAdded={() => {
          refetch();
          setShowAddDeviceDialog(false);
        }}
      />
    </>
  );
};
