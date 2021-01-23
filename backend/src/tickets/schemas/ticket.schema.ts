import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TicketStatusEnum } from '../enums/ticket-status.enum';
import { TicketTypeEnum } from '../enums/ticket-type.enum';
import { TicketPriorityEnum } from '../enums/ticket-priority.enum';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Ticket {
  @Prop()
  subject: string;

  @Prop()
  content: string;

  @Prop({ enum: TicketStatusEnum })
  status: string;

  @Prop({ enum: TicketTypeEnum })
  type: string;

  @Prop({ enum: TicketPriorityEnum })
  priority: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
