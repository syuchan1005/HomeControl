import React, { FC } from 'react';
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useMutation, useQuery } from '@apollo/react-hooks';

import {
  DeviceNamesQuery as DeviceNamesQueryData,
  DeviceNamesQueryVariables,
  AddDeviceWidgetMutation as AddDeviceWidgetMutationData,
  AddDeviceWidgetMutationVariables,
} from '@common/GQLTypes';
import DeviceNames from '@client/queries/DeviceNames.gql';
import AddDeviceWidget from '@client/queries/AddDeviceWidgetMutation.gql';

interface AddDeviceWidgetDialogProps {
  open: boolean;
  onClose?: () => void;
  onAdded?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

const AddDeviceWidgetDialog: FC<AddDeviceWidgetDialogProps> = (
  props: AddDeviceWidgetDialogProps,
) => {
  const classes = useStyles(props);
  const {
    open,
    onClose,
    onAdded,
  } = props;

  const { data } = useQuery<DeviceNamesQueryData,
    DeviceNamesQueryVariables>(DeviceNames);

  const [doAddWidget, { loading }] = useMutation<AddDeviceWidgetMutationData,
    AddDeviceWidgetMutationVariables>(AddDeviceWidget, {
      onCompleted(controllerData) {
        if (controllerData && controllerData.addDeviceWidget) {
          if (onAdded) onAdded();
        }
      },
    });

  return (
    <Dialog open={open} onClose={onClose}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <DialogTitle>Add DeviceWidget</DialogTitle>

      <List>
        {(data && data.devices) && data.devices.map((device) => (
          <ListItem
            key={device.id}
            button
            onClick={() => doAddWidget({ variables: { id: device.id } })}
          >
            <ListItemText
              primary={device.name}
              secondary={device.type.type}
            />
          </ListItem>
        ))}
      </List>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDeviceWidgetDialog;
