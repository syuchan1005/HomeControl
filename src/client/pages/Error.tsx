import React, { FC } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  main: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: '2rem',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const Error: FC = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const location = useLocation();

  return (
    <main className={classes.main}>
      <div className={classes.errorText}>Error</div>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(location).map(([k, v]) => (
              <TableRow key={k}>
                <TableCell>{k}</TableCell>
                <TableCell>{v}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button className={classes.button} onClick={() => history.push('/')}>Go to home</Button>
    </main>
  );
};

export default Error;
