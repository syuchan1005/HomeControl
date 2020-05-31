import React, { FC, useMemo } from 'react';
import {
  createStyles, Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper, Theme,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useMutation, useQuery } from '@apollo/react-hooks';

import {
  RemoteController as RemoteControllerType,
  RemoteControllerQuery as RemoteControllerQueryData,
  RemoteControllerQueryVariables,
  SendRemoteControllerButtonMutation as SendRemoteControllerButtonMutationData,
  SendRemoteControllerButtonMutationVariables,
} from '@common/GQLTypes';
import RemoteController from '@client/queries/RemoteController.gql';
import SendRemoteControllerButton from '@client/queries/SendRemoteControllerButton.gql';

type RemoteControllerWidgetProps = (({
  controllerId: number;
} | {
  controller: RemoteControllerType;
}) & {
  sendIR?: boolean;
  onAddButtonClick?: (controllerId: number) => void;
});

const useStyles = makeStyles((theme: Theme) => createStyles({
  grid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    minWidth: 160,
  },
  controllerTitle: {
    marginLeft: theme.spacing(1),
  },
}));

const RemoteControllerWidget: FC<RemoteControllerWidgetProps> = (
  props: RemoteControllerWidgetProps,
) => {
  const classes = useStyles(props);
  const {
    // @ts-ignore
    controller: propController,
    // @ts-ignore
    controllerId,
    onAddButtonClick,
    sendIR,
  } = props;

  const [doSend] = useMutation<SendRemoteControllerButtonMutationData,
    SendRemoteControllerButtonMutationVariables>(SendRemoteControllerButton);

  const {
    data,
  } = useQuery<RemoteControllerQueryData,
    RemoteControllerQueryVariables>(RemoteController, {
      skip: !!propController || !controllerId,
      variables: { id: controllerId },
    });

  const controller: RemoteControllerType | undefined = useMemo(() => propController
    || (data && data.remoteController),
  [propController, data]);

  return (
    <Grid item lg={2} md={3} sm={4} xs={12} className={classes.grid}>
      <Paper className={classes.paper}>
        {controller ? (
          <>
            <Typography className={classes.controllerTitle} component="div" variant="h6">
              {controller.name}
            </Typography>

            <List>
              {controller.buttons.sort((a, b) => a.id - b.id).map((button) => (
                <ListItem
                  key={button.name}
                  // @ts-ignore
                  button={sendIR}
                  onClick={() => sendIR && doSend({ variables: { id: button.id } })}
                >
                  <ListItemText style={{ textAlign: 'center' }}>{button.name}</ListItemText>
                </ListItem>
              ))}
              {(onAddButtonClick) && (
                <ListItem button onClick={() => onAddButtonClick(controller.id)}>
                  <ListItemIcon><AddIcon /></ListItemIcon>
                  <ListItemText>Add Button</ListItemText>
                </ListItem>
              )}
            </List>
          </>
        ) : (
          <Typography className={classes.controllerTitle} component="div" variant="h6">
            No Controller
          </Typography>
        )}
      </Paper>
    </Grid>
  );
};

export default RemoteControllerWidget;
