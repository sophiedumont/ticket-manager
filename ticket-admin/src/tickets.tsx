import { DateField, ChipField,  SelectInput, ReferenceInput, List,ReferenceField, Datagrid, TextField,Create, Edit, SimpleForm, TextInput  } from 'react-admin';
import * as React from "react";


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
      <ReferenceField label="Creator" source="creator" reference="admin/users">
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField label="Assigned to" source="assignedTo" reference="admin/users">
        <TextField source="username" />
      </ReferenceField>
    </Datagrid>
  </List>
);


export const TicketCreate = (props : any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="subject" />
      <TextInput multiline source="content" />
      <SelectInput source="type" choices={[
        { id: 'bug', name: 'Bug' },
        { id: 'question', name: 'Question' },
      ]} />
      <SelectInput source="priority" choices={[
        { id: 'high', name: 'High' },
        { id: 'medium', name: 'Medium' },
        { id: 'low', name: 'Low' },
      ]} />
    </SimpleForm>
  </Create>
);

export const TicketEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled label="Id" source="id" />
      <TextInput source="subject" />
      <TextInput multiline source="content"/>
      <SelectInput source="type" choices={[
        { id: 'bug', name: 'Bug' },
        { id: 'question', name: 'Question' },
      ]} />
      <SelectInput source="priority" choices={[
        { id: 'high', name: 'High' },
        { id: 'medium', name: 'Medium' },
        { id: 'low', name: 'Low' },
      ]} />
      <SelectInput source="status" choices={[
        { id: 'in-progress', name: 'In progress' },
        { id: 'closed', name: 'Closed' },
      ]} />
      <ReferenceInput label="Assigned to" source="assignedTo" reference="admin/users" filter={{isAdmin:true}}>
        <SelectInput optionText="username" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);