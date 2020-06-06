import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import {
  Backdrop,
  CircularProgress,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import UserAuthDialog from '@client/components/UserAuthDialog';

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const GoogleAuth: FC = (props) => {
  const classes = useStyles(props);
  const [clientId, setClientId] = useState<string | undefined>(undefined);

  useEffect(() => {
    axios.get('/oauth/client')
      .then((res) => {
        setClientId(res.data.id);
      });
  }, []);

  return (
    <>
      <Backdrop open={!clientId} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <UserAuthDialog
        clientId={clientId}
        onlyLogin
        open
        onLogin={(token) => {
          window.location.href = `/oauth/google/auth/callback${window.location.search}&access_token=${token.accessToken}`;
          return true;
        }}
      />
    </>
  );
};

export default GoogleAuth;
