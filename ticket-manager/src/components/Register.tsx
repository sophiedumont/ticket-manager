import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from 'react-redux'
import { rootState } from '../Redux/store'
import { Snackbar } from '@material-ui/core'
import { useHistory } from "react-router-dom";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import {
  register,
  resetRegisterError,
  resetRegisterSuccess,
} from '../Redux/User/action'
import { authStyle } from '../common/authTheme'

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Register = () => {
  const classes = authStyle();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerSuccess = useSelector((state: rootState) => state.user.register)
  let registerError = useSelector((state: rootState) => state.user.registerError)
  let errorMessage = useSelector((state: rootState) => state.user.errorMessage)
  const dispatch = useDispatch()
  let history = useHistory();

  const registerUser = async () => {
    dispatch(await register(username, email, password, confirmPassword));
  }

  const handleCloseSnackBarSuccess = () => {
    dispatch(resetRegisterSuccess());
    history.push("/login");
  }
  const handleCloseSnackBarError = () => {
    dispatch(resetRegisterError());
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
          Sign up
        </Typography>
        <TextField
          onChange={e =>setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoFocus
        />
        <TextField
          onChange={e =>setUsername(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
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
        />
        <TextField
          onChange={e =>setConfirmPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm password"
          type="password"
          id="confirmPassword"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={registerUser}
        >
          Sign In
        </Button>
        <Snackbar open={registerSuccess} autoHideDuration={3000} onClose={handleCloseSnackBarSuccess}>
          <Alert onClose={handleCloseSnackBarSuccess} severity="success">
            Created !
          </Alert>
        </Snackbar>
        <Snackbar open={registerError} autoHideDuration={6000} onClose={() => handleCloseSnackBarError()}>
          <Alert onClose={() => handleCloseSnackBarError()} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}

export default Register;