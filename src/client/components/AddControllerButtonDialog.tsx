import React, { FC, useCallback, useState } from 'react';
import {
  AddRemoteControllerButtonMutation as AddRemoteControllerButtonMutationData,
  AddRemoteControllerButtonMutationVariables,
} from '@common/GQLTypes';
import {
  Backdrop,
  Button, CircularProgress, createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, makeStyles,
  TextField, Theme, Typography,
} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';


import AddRemoteControllerButton from '@client/queries/AddRemoteControllerButtonMutation.gql';

interface AddControllerButtonDialogProps {
  controllerId: number | undefined;
  onClose?: () => void;
  onAdded?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
  warnText: {
    margin: theme.spacing(1, 0),
  },
}));

const AddControllerButtonDialog: FC<AddControllerButtonDialogProps> = (
  props: AddControllerButtonDialogProps,
) => {
  const classes = useStyles(props);
  const {
    controllerId,
    onClose,
    onAdded,
  } = props;

  const [name, setName] = useState('');

  const [doAddButton, {
    loading,
  }] = useMutation<AddRemoteControllerButtonMutationData,
    AddRemoteControllerButtonMutationVariables>(AddRemoteControllerButton, {
      variables: {
        id: controllerId,
        name,
      },
      onCompleted(data) {
        if (data && data.addRemoteControllerButton) {
          if (onAdded) onAdded();
        }
      },
    });

  const clickAdd = useCallback(() => {
    if (name.length > 0) {
      doAddButton();
    }
  }, [doAddButton, name]);

  return (
    <Dialog open={!!controllerId} onClose={onClose}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <DialogTitle>Add button</DialogTitle>

      <DialogContent>
        <TextField label="button name" value={name} onChange={(e) => setName(e.target.value)} />

        <Typography
          component="div"
          variant="body1"
          className={classes.warnText}
        >
          Click on the add button below and then press the button within 3 seconds.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button color="secondary" onClick={clickAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddControllerButtonDialog;
