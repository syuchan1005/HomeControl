import React, { FC } from 'react';
import {
  Backdrop,
  Button, CircularProgress, createStyles,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemText, makeStyles, Theme,
} from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/react-hooks';

import {
  RemoteControllerNamesQuery as RemoteControllerNamesQueryData,
  RemoteControllerNamesQueryVariables,
  AddRemoteControllerWidgetMutation as AddRemoteControllerWidgetMutationData,
  AddRemoteControllerWidgetMutationVariables,
} from '@common/GQLTypes';
import RemoteControllerNames from '@client/queries/RemoteControllerNames.gql';
import AddRemoteControllerWidget from '@client/queries/AddRemoteControllerWidgetMutation.gql';

interface AddRemoteControllerWidgetDialogProps {
  open: boolean;
  onClose?: () => void;
  onAdded?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

const AddRemoteControllerWidgetDialog: FC<AddRemoteControllerWidgetDialogProps> = (
  props: AddRemoteControllerWidgetDialogProps,
) => {
  const classes = useStyles(props);
  const {
    open,
    onClose,
    onAdded,
  } = props;

  const { data } = useQuery<RemoteControllerNamesQueryData,
    RemoteControllerNamesQueryVariables>(RemoteControllerNames);

  const [doAddWidget, { loading }] = useMutation<AddRemoteControllerWidgetMutationData,
    AddRemoteControllerWidgetMutationVariables>(AddRemoteControllerWidget, {
      onCompleted(controllerData) {
        if (controllerData && controllerData.addRemoteControllerWidget) {
          if (onAdded) onAdded();
        }
      },
    });

  return (
    <Dialog open={open} onClose={onClose}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <DialogTitle>Add RemoteControllerWidget</DialogTitle>

      <List>
        {(data && data.remoteControllers) && data.remoteControllers.map((controller) => (
          <ListItem
            key={controller.name}
            button
            onClick={() => doAddWidget({ variables: { id: controller.id } })}
          >
            <ListItemText>{controller.name}</ListItemText>
          </ListItem>
        ))}
      </List>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRemoteControllerWidgetDialog;
