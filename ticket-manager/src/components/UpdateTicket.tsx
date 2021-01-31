import * as React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TicketForm from './TicketForm'
import Layout from './Layout'
import Typography from '@material-ui/core/Typography';
import { pageStyles } from '../common/theme'
import { getOneTicket, updateOneTicket } from '../Redux/Ticket/actions'
import { useDispatch, useSelector } from 'react-redux'
import {
  useParams
} from "react-router-dom";
import { rootState } from '../Redux/store'
import { useEffect, useState } from 'react'



const UpdateTicket = () => {
  //@ts-ignore
  let { id } = useParams();
  const ticketToUpdate = useSelector((state: rootState) => state.ticket.oneTicket);
  const [didInit, setInit] = useState(false);
  const dispatch = useDispatch()

  console.log(id);

  console.log({didInit})

  useEffect( () => {
    if(!didInit){
      const getTicket = async () => {
        setInit(true);
        dispatch(await getOneTicket(id));
      }
      getTicket();
    }
  });


  const handleSubmit = async (subject:string, content:string, type:string, priority:string) => {
    dispatch(await updateOneTicket(id, subject, content, type, priority));
  }

  const classes = pageStyles();
  return (
    <div className={classes.root}>
      <Layout />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h1" variant="h5">
                  Update a ticket
                </Typography>
                <TicketForm handleSubmit={handleSubmit} ticket={ticketToUpdate} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default UpdateTicket;