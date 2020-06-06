import React, { FC, useState } from 'react';
import {
  Fab,
  Grid,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import AddControllerDialog from '@client/components/AddControllerDialog';
import { useQuery } from '@apollo/react-hooks';

import {
  RemoteControllersQuery as RemoteControllersQueryData,
  RemoteControllersQueryVariables,
} from '@common/GQLTypes';
import RemoteControllers from '@client/queries/RemoteControllers.gql';
import AddControllerButtonDialog from '@client/components/AddControllerButtonDialog';
import RemoteControllerWidget from '@client/components/RemoteControllerWidget';

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

const RemoteControllerList: FC = (props) => {
  const classes = useStyles(props);

  const [showAddControllerDialog, setShowAddControllerDialog] = useState(false);

  const [showAddButtonDialogId, setShowAddButtonDialogId] = useState<number | undefined>(undefined);

  const {
    data,
    refetch,
  } = useQuery<RemoteControllersQueryData, RemoteControllersQueryVariables>(RemoteControllers);

  return (
    <>
      <main className={classes.main}>
        {!data || ((data.remoteControllers.length === 0) ? (
          <div className={classes.empty}>
            <div>Empty</div>
          </div>
        ) : (
          <Grid container spacing={1}>
            {data.remoteControllers.map((controller) => (
              <RemoteControllerWidget
                key={controller.id}
                controller={controller}
                onAddButtonClick={(id) => setShowAddButtonDialogId(id)}
                sendIR
              />
            ))}
          </Grid>
        ))}
      </main>

      <Fab
        color="secondary"
        className={classes.fab}
        onClick={() => setShowAddControllerDialog(true)}
      >
        <AddIcon />
      </Fab>

      <AddControllerDialog
        open={showAddControllerDialog}
        onClose={() => setShowAddControllerDialog(false)}
        onAdded={() => {
          setShowAddControllerDialog(false);
          refetch();
        }}
      />

      <AddControllerButtonDialog
        controllerId={showAddButtonDialogId}
        onClose={() => setShowAddButtonDialogId(undefined)}
        onAdded={() => {
          setShowAddButtonDialogId(undefined);
          refetch();
        }}
      />
    </>
  );
};

export default RemoteControllerList;
