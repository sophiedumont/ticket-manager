import * as React from 'react';
import {
  List,
  BooleanField,
  Datagrid,
  TextField,
  EmailField,
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  Edit,
  ArrayInput,
  ChipField,
  SimpleFormIterator
} from 'react-admin';

export const UserList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <EmailField source="email" />
      <BooleanField label="Admin" source="isAdmin" />
    </Datagrid>
  </List>
);

export const UserCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="email" />
      <TextInput source="password" />
      <BooleanInput label="Admin" source="isAdmin" />
    </SimpleForm>
  </Create>
);

export const UserEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled label="Id" source="id" />
      <TextInput source="username" />
      <TextInput source="email" />
      <BooleanInput label="Admin" source="isAdmin" />
    </SimpleForm>
  </Edit>
);