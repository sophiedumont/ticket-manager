import React from 'react';
import { DateField, ChipField, List, Datagrid, TextField } from 'react-admin';

export const TicketList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="subject" />
      <TextField source="content" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <ChipField source="status" />
      <ChipField source="priority" />
      <ChipField source="type" />
      {/*
      <TextField source="creator" />
      <TextField source="assignedTo" />
*/}
    </Datagrid>
  </List>
);
