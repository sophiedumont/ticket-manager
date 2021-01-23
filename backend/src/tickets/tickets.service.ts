import { Model } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(createTicketDto);
    return createdTicket.save();
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find().exec();
  }

  async findOne(id: string): Promise<Ticket> {
    return this.ticketModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const updatedTicket = this.ticketModel.updateOne(
      { _id: id },
      updateTicketDto,
    );
    if (!updatedTicket) {
      throw 'Ticket not found';
    }
    return updatedTicket;
  }

  async remove(id: string) {
    const removedTicket = this.ticketModel.deleteOne({ _id: id }).exec();
    if (!removedTicket) {
      throw 'Ticket not found';
    }
    return removedTicket;
  }
}
