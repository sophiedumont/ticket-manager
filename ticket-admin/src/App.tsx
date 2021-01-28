import React from 'react';
import './App.css';
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import authProvider from './authProvider';
import { UserList } from './users';
import { TicketList } from './tickets';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('auth');
  console.log({ token });
  //@ts-ignore
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://localhost:3000', httpClient);

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    title="Example Admin"
  >
    <Resource
      name="admin/tickets"
      options={{ label: 'Tickets' }}
      list={TicketList}
    />
    <Resource
      name="admin/users
    "
      options={{ label: 'Users' }}
      list={UserList}
    />
  </Admin>
);

export default App;
