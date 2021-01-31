import React from 'react';
import './App.css';
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import authProvider from './authProvider';
import { UserList, UserCreate, UserEdit } from './users';
import { TicketList, TicketCreate, TicketEdit } from './tickets';
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('auth');
  //@ts-ignore
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://localhost:3000', httpClient);

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    title="Admin pannel"
  >
    <Resource
      name="admin/tickets"
      options={{ label: 'Tickets' }}
      list={TicketList}
      create={TicketCreate}
      edit={TicketEdit}
      icon={PostIcon}
    />
    <Resource
      name="admin/users"
      options={{ label: 'Users' }}
      list={UserList}
      create={UserCreate}
      edit={UserEdit}
      icon={UserIcon}
    />
  </Admin>
);

export default App;
