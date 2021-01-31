import * as React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppBar from '@material-ui/core/AppBar';
import { useHistory } from 'react-router-dom'
import { pageStyles } from '../common/theme'
import { useDispatch} from 'react-redux'
import { logoutAndUnsetJWT } from '../Redux/User/action'

const Layout = () => {
  const classes = pageStyles();
  let history = useHistory();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logoutAndUnsetJWT());
    history.push("/login");
  }

  return (
      <AppBar position="absolute">
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h5"
            color="inherit"
            className={classes.title}
            onClick={() => {
              history.push("/tickets");
            }}
          >
            Ticket Manager
          </Typography>
          <IconButton onClick={onLogout} color="inherit">
            <Badge color="secondary">
              <ExitToAppIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
  );
}

export default Layout;