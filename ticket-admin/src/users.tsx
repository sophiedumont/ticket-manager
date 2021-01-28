import * as React from 'react';
import {
  List,
  BooleanField,
  Datagrid,
  TextField,
  EmailField,
} from 'react-admin';

export const UserList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <EmailField source="email" />
      <BooleanField source="isAdmin" />
    </Datagrid>
  </List>
);
