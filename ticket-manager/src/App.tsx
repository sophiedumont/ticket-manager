import React from 'react';
import Login from './components/Login';
import Tickets from './components/Tickets';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import CreateTicket from './components/CreateTicket'
import UpdateTicket from './components/UpdateTicket'
import Register from './components/Register'
import PrivateRoute from './components/PrivateRoute'
import { useSelector } from 'react-redux'
import { rootState } from './Redux/store'


function App() {
  const canUseApp = useSelector((state: rootState) => state.user.canUseApp);

  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute canUseApp={canUseApp}>
            <Route exact path="/tickets" component={Tickets} />
            <Route exact path="/create" component={CreateTicket} />
            <Route exact path="/edit/:id" component={UpdateTicket} />
          </PrivateRoute>
        </Switch>
    </Router>
  )
}

export default App;
