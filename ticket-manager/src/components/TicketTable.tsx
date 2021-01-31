import React, {useEffect } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid, RowParams } from '@material-ui/data-grid'
import Typography from '@material-ui/core/Typography';
import { ColDef } from '@material-ui/data-grid'
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux'
import { rootState } from '../Redux/store'
import { getUserConnectedInfo, resetUserInfoError } from '../Redux/User/action'
import { getUserConnectedTickets, resetTicketError } from '../Redux/Ticket/actions'
import CustomNoRowsOverlay from './CustomeDataGrid'
import { useHistory } from 'react-router-dom'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const columns: ColDef[] = [
  { field: 'id', headerName: 'Id', width: 130,  hide: true },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'subject', headerName: 'Subject', width: 130 },
  { field: 'content', headerName: 'Content', width: 260 },
  { field: 'priority', headerName: 'Priority', width: 130 },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'createdAt', headerName: 'CreatedAt', width: 200 },
  { field: 'updatedAt', headerName: 'UpdateAt', width: 200 },
];

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function TicketTable() {
  const classes = useStyles();

  const user = useSelector((state: rootState) => state.user.userInfo);
  const tickets = useSelector((state: rootState) => state.ticket.tickets);
  const userInfoError = useSelector((state: rootState) => state.user.getUserError)
  const ticketInfoError = useSelector((state: rootState) => state.ticket.getTicketsError)
  const dispatch = useDispatch();
  let history = useHistory();


  useEffect( () => {
    if(!user.username) {
      const getUserInfo = async () => {
        dispatch(await getUserConnectedInfo());
      }
      getUserInfo();
    }
  });

  useEffect( () => {
    if(!tickets){
      const getTickets = async () => {
        dispatch(await getUserConnectedTickets());
      }
      getTickets();
    }
  });

  const handleCloseSnackBar = () => {
    dispatch(resetUserInfoError());
  }
  const handleCloseTicketSnackBar = () => {
    dispatch(resetTicketError());
  }
  const navigateToUpdate = (rowParam: RowParams) => {
    history.push(`/edit/${rowParam.row.id}`)
  }

  const rows = tickets || [];
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {user.username}'s tickets
      </Typography>
      <Box display="flex" justifyContent={'flex-end'}>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<AddIcon />}
          fullWidth={false}
          onClick={() => {
            history.push('/create')
          }}
        >
          Create
        </Button>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }} rows={rows} columns={columns} pageSize={5} onRowClick={navigateToUpdate} />
      </div>
      <Snackbar open={userInfoError} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity="error">
          Can't find User
        </Alert>
      </Snackbar>
      <Snackbar open={ticketInfoError} autoHideDuration={6000} onClose={handleCloseTicketSnackBar}>
        <Alert onClose={handleCloseTicketSnackBar} severity="error">
          Can't find User
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}