import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Ticket } from '../../tickets/schemas/ticket.schema';
import * as mongoose from 'mongoose';
import { TicketStatusEnum } from '../../tickets/enums/ticket-status.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  readonly _id: ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }])
  createdTickets: Ticket[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }])
  assignedTickets: Ticket[];

  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
