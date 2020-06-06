import React, {
  FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useValidationState, ValidateOperations } from '@client/hooks/useValidationState';

import {
  AddDeviceMutation,
  AddDeviceMutationVariables,
  DeviceTypesQuery,
  DeviceTypesQueryVariables,
} from '@common/GQLTypes';
import AddDevice from '@client/queries/AddDeviceMutation.gql';
import DeviceTypes from '@client/queries/DeviceTypesQuery.gql';

interface AddDeviceDialogProps {
  open: boolean;
  onClose?: () => void;
  onAdded?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
  formContent: {
    display: 'grid',
    gridColumn: 'auto',
    gridRowGap: theme.spacing(1),
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const AddDeviceDialog: FC<AddDeviceDialogProps> = (props: AddDeviceDialogProps) => {
  const classes = useStyles(props);
  const {
    open,
    onClose,
    onAdded,
  } = props;

  const [showValidate, setShowValidate] = useState(false);
  const [name, setName, nameError, hasNameError] = useValidationState('', [
    ValidateOperations.required(),
  ], showValidate);
  const [type, setType, typeError, hasTypeError] = useValidationState('', [
    ValidateOperations.required(),
  ], showValidate);
  const [willReportState, setWillReportState] = useState(false);
  const [roomHint, setRoomHint] = useState<string>(undefined);

  const {
    data: deviceTypeData,
    loading: deviceTypesLoading,
  } = useQuery<DeviceTypesQuery,
    DeviceTypesQueryVariables>(DeviceTypes);

  const [doAddDevice, { loading: addDeviceLoading }] = useMutation<AddDeviceMutation,
    AddDeviceMutationVariables>(AddDevice, {
      variables: {
        device: {
          name,
          type,
          roomHint,
          willReportState,
        },
      },
      onCompleted(data) {
        if (data && data.addDevice && onAdded) onAdded();
      },
    });

  const loadingArr = [deviceTypesLoading, addDeviceLoading];
  const loading = useMemo(() => loadingArr.some((e) => e), loadingArr);

  const clickAdd = useCallback(() => {
    setShowValidate(true);
    if (![hasNameError, hasTypeError].some((e) => e)) {
      doAddDevice();
    }
  }, [doAddDevice, hasNameError, hasTypeError]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <DialogTitle>Add Device</DialogTitle>

      <DialogContent className={classes.formContent}>
        <FormControl>
          <InputLabel required>Type</InputLabel>
          <Select
            value={type}
            required
            onChange={(e) => setType(e.target.value)}
            error={!!typeError}
          >
            {deviceTypeData && deviceTypeData.deviceTypes.map((d) => (
              <MenuItem key={d.type} value={d.type}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
        />
        <FormControlLabel
          control={(
            <Switch
              checked={willReportState}
              onChange={(e) => setWillReportState(e.target.checked)}
              color="primary"
            />
          )}
          label="willReportState"
        />
        <TextField
          label="RoomHint"
          value={roomHint}
          onChange={(e) => setRoomHint(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Close
        </Button>
        <Button color="secondary" onClick={clickAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};
