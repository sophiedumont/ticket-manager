import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import { Save } from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { rootState } from '../Redux/store'
import { useHistory } from 'react-router-dom'
import { resetCreateTicketError, resetUpdateTicketError } from '../Redux/Ticket/actions'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import Box from '@material-ui/core/Box'
import { TicketModel } from '../Redux/Ticket/reducer'
import { usePrevious } from '../common/usePrevious'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    button: {
      display: "flex",
      justifyContent: "flex-end",
      marginRight: theme.spacing(3),
    },
  }),
);

export interface TicketFormProps {
  handleSubmit: (subject:string, content:string, type:string, priority:string) => Promise<void>
  ticket?: TicketModel
}

export default function TicketForm({ handleSubmit, ticket }: TicketFormProps) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [subject, setSubject] = useState(ticket ? ticket.subject : '');
  const [content, setContent] = useState(ticket ? ticket.content : '');
  const [type, setType] = useState(ticket ? ticket.type : '');
  const [priority, setPriority] = useState(ticket ? ticket.priority : '');

  const updateSuccess = useSelector((state: rootState) => state.ticket.updatedTicket)
  const createSuccess = useSelector((state: rootState) => state.ticket.createdTicket)
  const createError = useSelector((state: rootState) => state.ticket.getCreatedTicketsError)
  const updateError = useSelector((state: rootState) => state.ticket.updateTicketError)
  let history = useHistory();

  const prevTicket = usePrevious(ticket);

  useEffect(() => {
    if (createSuccess || updateSuccess){
      history.push("/tickets");
    }
  }, [createSuccess || updateSuccess])


  useEffect(()=>{
    if (!prevTicket && ticket) {
      setSubject(ticket.subject);
      setContent(ticket.content);
      setType(ticket.type);
      setPriority(ticket.priority);
    }
  }, [ticket])

  const onSubmitTicket = async () => {
    await handleSubmit(subject, content, type, priority)
  }

  const handleCloseSnackBar = () => {
    dispatch(resetCreateTicketError());
    dispatch(resetUpdateTicketError());
  }

  const handleChangePriority = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPriority(event.target.value as string);
  };
  const handleChangeType = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };

  return (
      <Grid container spacing={3} >
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="subject"
            value={subject}
            name="subject"
            label="Subject"
            fullWidth
            onChange={e =>setSubject(e.target.value)}
            autoComplete="subject"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink id="demo-simple-select-placeholder-label-label" required>
                Priority
              </InputLabel>
              <Select
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={priority}
                onChange={handleChangePriority}
                displayEmpty
                className={classes.selectEmpty}
              >
                <MenuItem value={'high'}>High</MenuItem>
                <MenuItem value={'medium'}>Medium</MenuItem>
                <MenuItem value={'low'}>Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel shrink id="demo-simple-select-placeholder-label-label" required>
                Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={type}
                onChange={handleChangeType}
                displayEmpty
                className={classes.selectEmpty}
              >
                <MenuItem value={'question'}>Question</MenuItem>
                <MenuItem value={'bug'}>Bug</MenuItem>
              </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="content"
            name="content"
            value={content}
            label="Content"
            fullWidth
            autoComplete="content"
            multiline={true}
            onChange={e =>setContent(e.target.value)}
            rows={4}
          />
        </Grid>
        <Box display="flex" justifyContent={'flex-end'}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmitTicket}
            startIcon={<Save/>}
          >Save
          </Button>
        </Box>
          <Snackbar open={createError || updateError} autoHideDuration={6000} onClose={handleCloseSnackBar}>
            <Alert onClose={handleCloseSnackBar} severity="error">
              Ticket not created. Fill each field.
            </Alert>
          </Snackbar>
      </Grid>

  );
}