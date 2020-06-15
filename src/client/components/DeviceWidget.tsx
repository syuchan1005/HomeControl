import React, { FC, useCallback, useState } from 'react';
import { Device } from '@common/GQLTypes';
import {
  Collapse,
  Grid, List, ListItem, ListItemIcon, ListItemText,
  Paper, Table, TableBody, TableCell, TableContainer, TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Add as AddIcon, ExpandLess, ExpandMore } from '@material-ui/icons';
import { DataTable } from '@client/components/DataTable';

interface DeviceWidgetProps {
  device: Device,
  onClickAddTrait?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  titleMargin: {
    marginLeft: theme.spacing(1),
  },
  traitTitle: {
    margin: theme.spacing(1, 0, 0, 1),
  },
  providerTitleItem: {
    padding: theme.spacing(1, 2, 0, 2),
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const DeviceWidget: FC<DeviceWidgetProps> = (props: DeviceWidgetProps) => {
  const classes = useStyles(props);
  const {
    device,
    onClickAddTrait,
  } = props;

  const [openTraitIds, setOpenTraitIds] = useState<Array<number>>([]);

  const toggleTraitId = useCallback((traitId: number) => {
    if (openTraitIds.includes(traitId)) {
      setOpenTraitIds(openTraitIds.filter((id) => id !== traitId));
    } else {
      setOpenTraitIds([...openTraitIds, traitId]);
    }
  }, [openTraitIds, setOpenTraitIds]);

  return (
    <Grid item lg={2} md={3} sm={5} xs={12}>
      <Paper>
        <Typography
          className={classes.titleMargin}
          component="div"
          variant="h6"
        >
          {device.name}
        </Typography>
        <Typography
          className={classes.titleMargin}
          component="div"
          variant="subtitle1"
        >
          {device.type.name}
        </Typography>
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
        <List>
          {device.traits.map((trait) => (
            <React.Fragment key={trait.id}>
              <ListItem
                button
                onClick={() => toggleTraitId(trait.id)}
              >
                <ListItemText>{trait.type}</ListItemText>
                {openTraitIds.includes(trait.id) ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openTraitIds.includes(trait.id)}>
                <List component="div" dense disablePadding>
                  {Object.keys(trait)
                    .filter((k) => k.endsWith('Provider'))
                    .map((k) => (!Array.isArray(trait[k])
                      ? (
                        <React.Fragment key={k}>
                          <ListItem className={classes.providerTitleItem}>
                            <ListItemText primary={k} secondary={trait[k].type} />
                          </ListItem>
                          <DataTable data={trait[k].content} />
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={k}>
                          <ListItem className={classes.providerTitleItem}>
                            <ListItemText primary={k} />
                          </ListItem>
                          <List dense component="div" disablePadding>
                            {trait[k].map((p) => (
                              <React.Fragment key={p.providerType}>
                                <ListItem>
                                  <ListItemText
                                    primary={p.commandType}
                                    secondary={p.providerType}
                                  />
                                  {!p.content && (
                                    <ListItemText
                                      primary="<null>"
                                    />
                                  )}
                                </ListItem>
                                {p.content && (
                                  <DataTable data={p.content} />
                                )}
                              </React.Fragment>
                            ))}
                          </List>
                        </React.Fragment>
                      )))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}

          <ListItem button onClick={onClickAddTrait}>
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText>Add Trait</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  );
};
