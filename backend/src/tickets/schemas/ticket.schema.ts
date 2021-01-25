import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TicketStatusEnum } from '../enums/ticket-status.enum';
import { TicketTypeEnum } from '../enums/ticket-type.enum';
import { TicketPriorityEnum } from '../enums/ticket-priority.enum';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Ticket {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    alias: 'creatorId',
    name: 'creatorId',
  })
  creator: User | string;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  //assignedTo: User;

  @Prop()
  subject: string;

  @Prop()
  content: string;

  @Prop({ enum: TicketStatusEnum, default: TicketStatusEnum.NEW })
  status: string;

  @Prop({ enum: TicketTypeEnum })
  type: string;

  @Prop({ enum: TicketPriorityEnum })
  priority: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
