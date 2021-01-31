import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

export interface privateRouteProps {
  children: React.ReactNode[],
  canUseApp: boolean,
}

const PrivateRoute = ({ children, canUseApp, ...rest }: privateRouteProps) => {
  return (
    <Route {...rest} render={props => (
      canUseApp ? (
        <Switch>
          {children}
        </Switch>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location },
        }} />
      )
    )} />
  )
}

export default PrivateRoute