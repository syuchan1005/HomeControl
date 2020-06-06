import React, { FC, useCallback, useState } from 'react';
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/react-hooks';

import {
  AddRemoteControllerMutation as AddRemoteControllerMutationData,
  AddRemoteControllerMutationVariables,
} from '@common/GQLTypes';
import AddRemoteController from '@client/queries/AddRemoteControllerMutation.gql';

interface AddControllerDialogProps {
  open: boolean;
  onClose?: () => void;
  onAdded?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));


const AddControllerDialog: FC<AddControllerDialogProps> = (props: AddControllerDialogProps) => {
  const classes = useStyles(props);
  const {
    open,
    onClose,
    onAdded,
  } = props;

  const [name, setName] = useState('');

  const [doAddController, {
    loading,
  }] = useMutation<AddRemoteControllerMutationData,
    AddRemoteControllerMutationVariables>(AddRemoteController, {
      variables: { name },
      onCompleted(data) {
        if (data && data.addRemoteController) {
          if (onAdded) onAdded();
        }
      },
    });

  const clickAdd = useCallback(() => {
    if (name.length > 0) {
      doAddController();
    }
  }, [doAddController, name]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <DialogTitle>Add controller</DialogTitle>

      <DialogContent>
        <TextField label="controller name" value={name} onChange={(e) => setName(e.target.value)} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button color="secondary" onClick={clickAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddControllerDialog;
