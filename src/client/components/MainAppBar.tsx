import React, { FC, useCallback, useState } from 'react';
import {
  AppBar, createStyles,
  IconButton,
  List,
  ListItem,
  ListItemText, makeStyles,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { clearToken, getLoggedInSelector } from '@client/store/UserAuth';

const useStyles = makeStyles(() => createStyles({
  title: {
    flexGrow: 1,
  },
}));

const MainAppBar: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const loggedIn = useSelector(getLoggedInSelector);

  const [openDrawer, setOpenDrawer] = useState(false);

  const clickRoute = useCallback((route) => {
    history.push(route);
    setOpenDrawer(false);
  }, [history]);

  const clickLogout = useCallback(() => {
    dispatch(clearToken());
    history.push('/');
    setOpenDrawer(false);
  }, [dispatch]);

  return (
    <>
      <AppBar>
        <Toolbar>
          {loggedIn && (
            <>
              <IconButton edge="start" color="inherit" onClick={() => setOpenDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}
                open={openDrawer}
              >
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <List>
                    <ListItem button onClick={() => clickRoute('/')}>
                      <ListItemText>Home</ListItemText>
                    </ListItem>
                    <ListItem button onClick={() => clickRoute('/sensor')}>
                      <ListItemText>Sensor List</ListItemText>
                    </ListItem>
                    <ListItem button onClick={() => clickRoute('/remote_controller')}>
                      <ListItemText>Remote Controller List</ListItemText>
                    </ListItem>
                  </List>
                  <div style={{ flexGrow: 1 }} />
                  <List>
                    <ListItem button onClick={clickLogout}>
                      <ListItemText>Logout</ListItemText>
                    </ListItem>
                  </List>
                </div>
              </SwipeableDrawer>
            </>
          )}
          <Typography
            component="div"
            variant="h6"
            className={classes.title}
          >
            HomeControl
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default MainAppBar;
