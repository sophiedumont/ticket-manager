import * as React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {pageStyles} from '../common/theme';
import { createOneTicket } from '../Redux/Ticket/actions'
import TicketForm from './TicketForm'
import Layout from './Layout'


const CreateTicket = () => {
  const dispatch = useDispatch()

  const classes = pageStyles();

  const handleSubmit = async (subject:string, content:string, type:string, priority:string) => {
    dispatch(await createOneTicket(subject, content, type, priority));
  }

  return (
    <div className={classes.root}>
      <Layout />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography className={classes.title} component="h1" variant="h5">
                  Create a ticket
                </Typography>
                <TicketForm handleSubmit={handleSubmit} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default CreateTicket;