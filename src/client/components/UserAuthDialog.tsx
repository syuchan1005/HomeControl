import React, {
  FC, useCallback, useMemo, useState,
} from 'react';
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogTitle,
  IconButton,
  TextField,
  Theme,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { setToken } from '@client/store/UserAuth';
import SignUpMutation from '@client/queries/SignUp.gql';
import LoginMutation from '@client/queries/Login.gql';
import {
  SignUpMutation as SignUpMutationData,
  SignUpMutationVariables,
  LoginMutation as LoginMutationData,
  LoginMutationVariables, AuthToken,
} from '@common/GQLTypes';

interface UserAuthDialogProps {
  onlyLogin?: boolean;
  open: boolean;
  clientId?: string;
  onLogin?: (token: AuthToken) => boolean | void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  formContent: {
    display: 'grid',
    gridColumn: 'auto',
    gridRowGap: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

const isNotEmpty = (str?: string) => !!str && str.length > 0;

const UserAuthDialog: FC<UserAuthDialogProps> = (props: UserAuthDialogProps) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const {
    onlyLogin,
    open,
    onLogin,
    clientId,
  } = props;

  const [showLoginModal, setShowLoginModal] = useState(!!onlyLogin);
  const title = useMemo(() => (showLoginModal ? 'Login' : 'SignUp'), [showLoginModal]);

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');


  const [doLogin] = useMutation<LoginMutationData,
    LoginMutationVariables>(LoginMutation, {
      variables: { username, password, clientId },
      onCompleted(data) {
        let showLoading = false;
        if (onLogin) {
          showLoading = !!onLogin(data.login);
        } else {
          dispatch(setToken(data.login));
        }
        setLoading(showLoading);
      },
      onError() {
        setLoading(false);
      },
    });

  const [doSignUp] = useMutation<SignUpMutationData,
    SignUpMutationVariables>(SignUpMutation, {
      variables: { username, password },
      onCompleted(data) {
        if (data.signUp) {
          doLogin();
        } else {
          setLoading(false);
        }
      },
      onError() {
        setLoading(false);
      },
    });

  const clickSignUp = useCallback(() => {
    if (isNotEmpty(username) && isNotEmpty(password) && password === rePassword) {
      setLoading(true);
      doSignUp();
    }
  }, [username, password, rePassword]);

  const clickLogin = useCallback(() => {
    if (isNotEmpty(username) && isNotEmpty(password)) {
      setLoading(true);
      doLogin();
    }
  }, [username, password]);

  return (
    <Dialog open={open}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <DialogTitle>
        {(showLoginModal && !onlyLogin) && (
          <IconButton
            size="small"
            className={classes.backButton}
            onClick={() => setShowLoginModal(false)}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        {title}
      </DialogTitle>

      <DialogContent className={classes.formContent}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!showLoginModal && (
          <TextField
            label="(Re)Password"
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => (showLoginModal ? clickLogin : clickSignUp)()}
        >
          {title}
        </Button>
      </DialogActions>

      {!showLoginModal && (
        <DialogContent>
          <div>You already have account?</div>
          <Button
            fullWidth
            color="secondary"
            onClick={() => setShowLoginModal(true)}
          >
            Go to login
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default UserAuthDialog;
