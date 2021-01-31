import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TicketTable from './TicketTable'
import Layout from './Layout'
import { useSelector } from 'react-redux'
import { rootState } from '../Redux/store'
import { pageStyles } from '../common/theme'


const Tickets = () => {

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
                <TicketTable />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default Tickets;