import { Model } from 'mongoose';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(createTicketDto);
    return createdTicket.save();
  }

  async createWithCreator(
    userId: string,
    createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    const createdTicket = new this.ticketModel({
      ...createTicketDto,
      creator: userId,
    });
    return this.save(createdTicket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find().exec();
  }

  async findOne(id: string): Promise<Ticket> {
    return this.ticketModel.findOne({ _id: id }).exec();
  }

  async findOneWithCreator(id: string): Promise<Ticket> {
    return this.ticketModel.findOne({ _id: id }).populate('creator').exec();
  }

  async findAllByMe(userId: string): Promise<Ticket[]> {
    const result = await this.ticketModel.find({ creator: userId });
    return result;
  }

  async updateForUser(
    id: string,
    updateTicketDto: UpdateTicketDto,
    userId: string,
  ) {
    const ticket = await this.findOneWithCreator(id);
    if ((ticket.creator as User)._id.toString() === userId) {
      const result = await this.update(id, updateTicketDto);
      return result;
    } else {
      throw 'You are not allowed to update this ticket';
    }
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

  async save(ticketToSave: TicketDocument) {
    const ticket = await ticketToSave.save();
    let creator;
    if (ticket.populated('creator')) {
      creator = ticket.creator as User;
    } else {
      const creatorId = ticket.creator as string;
      creator = await this.userService.findOne(creatorId);
    }
    if (!creator.createdTickets.some((t) => t === ticket.id)) {
      creator.createdTickets.push(ticket.id);
      await this.userService.updateDocument(creator._id.toString(), creator);
    }
    return ticket;
  }
}
