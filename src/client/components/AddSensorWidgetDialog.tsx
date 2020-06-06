import React, { Fragment, FC, useState } from 'react';
import {
  Backdrop,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import {
  SensorsQuery as SensorsQueryData,
  SensorsQueryVariables,
  AddSensorWidgetMutation as AddSensorWidgetMutationData,
  AddSensorWidgetMutationVariables,
} from '@common/GQLTypes';
import AddSensorWidgetMutation from '@client/queries/AddSensorWidgetMutation.gql';
import SensorsQuery from '@client/queries/Sensors.gql';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

interface AddSensorWidgetDialogProps {
  open: boolean;
  onClose?: () => void;
  onAdded?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

const AddSensorWidgetDialog: FC<AddSensorWidgetDialogProps> = (
  props: AddSensorWidgetDialogProps,
) => {
  const classes = useStyles(props);
  const {
    open,
    onClose,
    onAdded,
  } = props;

  const {
    data,
  } = useQuery<SensorsQueryData,
    SensorsQueryVariables>(SensorsQuery);

  const [openList, setOpenList] = useState<string[]>([]);

  const [doAddWidget, { loading }] = useMutation<AddSensorWidgetMutationData,
    AddSensorWidgetMutationVariables>(AddSensorWidgetMutation, {
      onCompleted(sensorData) {
        if (sensorData && sensorData.addSensorWidget) {
          if (onAdded) onAdded();
        }
      },
    });

  return (
    <Dialog open={open} onClose={onClose}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <DialogTitle>Add SensorWidget</DialogTitle>

      <List>
        {(data && data.sensors) && data.sensors.map((sensor) => (
          <Fragment key={sensor.name}>
            <ListItem
              button
              onClick={() => setOpenList(openList.includes(sensor.name)
                ? openList.filter((name) => name !== sensor.name)
                : [...openList, sensor.name])}
            >
              <ListItemText>{sensor.name}</ListItemText>
              {openList.includes(sensor.name) ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openList.includes(sensor.name)}
              timeout="auto"
              unmountOnExit
            >
              <List disablePadding>
                {sensor.dataType.map((type) => (
                  <ListItem
                    key={`${sensor.name}.${type}`}
                    button
                    onClick={() => doAddWidget({
                      variables: { name: sensor.name, dataType: type },
                    })}
                  >
                    <ListItemText>{type}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ))}
      </List>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSensorWidgetDialog;
