import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from 'react-redux'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";
import { authStyle } from '../common/authTheme'
import { loginAndSetJWT, resetLoginError } from '../Redux/User/action'
import { rootState } from '../Redux/store'

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = () => {
  const classes = authStyle();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const jwtToken = useSelector((state: rootState) => state.user.jwt)
  const loginError = useSelector((state: rootState) => state.user.loginError)
  const dispatch = useDispatch()
  let history = useHistory();

  useEffect(() => {
    if (jwtToken.length) {
      history.push("/tickets");
    }
    console.log({jwtToken})
  }, [jwtToken])

  const loginAndSetJwt = async () => {
    dispatch(await loginAndSetJWT(username, password));
  }

  const handleCloseSnackBar = () => {
    dispatch(resetLoginError());
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Ticket Manager
        </Typography>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
          <TextField
            onChange={e =>setUsername(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            onChange={e =>setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginAndSetJwt}
          >
            Sign In
          </Button>
        <Snackbar open={loginError} autoHideDuration={6000} onClose={handleCloseSnackBar}>
          <Alert onClose={handleCloseSnackBar} severity="error">
            Wrong credentials
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}

export default Login;