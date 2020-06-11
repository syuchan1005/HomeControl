import React, { FC } from 'react';
import { Device } from '@common/GQLTypes';
import {
  Grid, List, ListItem, ListItemIcon, ListItemText,
  Paper, Table, TableBody, TableCell, TableContainer, TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';

interface DeviceWidgetProps {
  device: Pick<Device, 'id' | 'name' | 'type' | 'roomHint' | 'willReportState'>,
  onClickAddTrait?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  titleMargin: {
    marginLeft: theme.spacing(1),
  },
  traitTitle: {
    margin: theme.spacing(1, 0, 0, 1),
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const DeviceWidget: FC<DeviceWidgetProps> = (props: DeviceWidgetProps) => {
  const classes = useStyles(props);
  const {
    device,
    onClickAddTrait,
  } = props;

  return (
    <Grid item lg={2} md={3} sm={5} xs={12}>
      <Paper>
        <Typography className={classes.titleMargin} component="div" variant="h6">{device.name}</Typography>
        <Typography className={classes.titleMargin} component="div" variant="subtitle1">{device.type.name}</Typography>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>willReportState</TableCell>
                <TableCell>{JSON.stringify(device.willReportState)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>RoomHint</TableCell>
                <TableCell>{device.roomHint || 'None'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography className={classes.traitTitle}>Traits</Typography>
        <List dense>
          <ListItem button onClick={onClickAddTrait}>
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText>Add Trait</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  );
};
