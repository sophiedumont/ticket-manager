import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import * as mongoose from 'mongoose';
import { PageDto } from '../dto/page.dto';
const ObjectId = mongoose.Types.ObjectId;

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

  async findAll(page: PageDto): Promise<[Ticket[], number, string]> {
    try {
      const range = JSON.parse(page.range);
      const limit = range[1] + 1 - range[0];
      const skip = range[0];
      const sort = page.sort ? JSON.parse(page.sort) : ['createdAt', 'desc'];
      const count = await this.findAllAndCount();
      const tickets = await this.ticketModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort({ [sort[0]]: sort[1] })
        .exec();
      return [tickets, count, range.join('-')];
    } catch (e) {
      throw 'Tickets not found';
    }
  }

  async findAllAndCount(): Promise<number> {
    return this.ticketModel.find().count().exec();
  }

  async findOne(id: string): Promise<Ticket> {
    return this.ticketModel.findOne({ _id: id }).exec();
  }

  async findOneWithCreator(id: string): Promise<Ticket> {
    return this.ticketModel.findOne({ _id: id }).populate('creator').exec();
  }

  async findAllWithCreator(id: string, page: PageDto): Promise<Ticket[]> {
    try {
      const range = JSON.parse(page.range);
      const limit = range[1] + 1 - range[0];
      const skip = range[0];
      const sort = page.sort ? JSON.parse(page.sort) : ['createdAt', 'desc'];
      const count = await this.findAllWithCreatorAndCount(id);

      const tickets = await this.ticketModel
        .find({ creator: id })
        .limit(limit)
        .skip(skip)
        .sort({ [sort[0]]: sort[1] })
        .exec();
      return [tickets, count, range.join('-')];
    } catch (e) {
      throw 'Tickets not found';
    }
  }

  async findAllWithCreatorAndCount(id: string): Promise<number> {
    return this.ticketModel.find({ creator: id }).count().exec();
  }

  /*async updateForUser(
    id: string,
    updateTicketDto: UpdateTicketDto,
    userId: string,
  ) {
    const ticket = await this.findOneWithCreator(id);
    if ((ticket.creator as User)._id.toString() === userId) {
      const result = await this.update(id, updateTicketDto);
      return result;
    } else {
      throw { message: 'You are not allowed to update this ticket' };
    }
  }*/

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const updatedTicket = this.updateDocument(id, updateTicketDto);
    return updatedTicket;
  }

  async remove(id: string) {
    const removedTicket = this.ticketModel.deleteOne({ _id: id }).exec();
    if (!removedTicket) {
      throw { message: 'Ticket not found' };
    }
    return removedTicket;
  }

  async updateDocument(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
    const ticketFound = await this.findOne(id);
    console.log({ ticketFound });
    if (!ticketFound) {
      throw { message: 'Ticket not found' };
    }
    const ticketDoc = this.mergeDocumentsBeforeUpdate(ticketFound, ticket);
    console.log({ ticketDoc });
    return await this.save(ticketDoc);
  }

  private mergeDocumentsBeforeUpdate(
    ticket: Partial<Ticket>,
    ticketToMerge: Partial<Ticket>,
  ): TicketDocument {
    const mergedTicket = new this.ticketModel(ticket);
    for (const attr in ticketToMerge) {
      mergedTicket[attr] = ticketToMerge[attr];
    }
    return mergedTicket;
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
    if (
      !creator.createdTickets.some((t) => t.toString() === ticket.id.toString())
    ) {
      creator.createdTickets.push(ticket.id);
      await this.userService.updateDocument(creator._id.toString(), creator);
    }
    let userAssignedTo;
    if (ticket.populated('assignedTo')) {
      userAssignedTo = ticket.assignedTo as User;
    } else if (ObjectId.isValid(ticket.assignedTo as string)) {
      const assignedToId = ticket.assignedTo as string;
      userAssignedTo = await this.findOne(assignedToId);
    }
    if (userAssignedTo) {
      const user = userAssignedTo;
      if (!user.assignedTickets.some((t) => t === ticket.id)) {
        user.assignedTickets.push(ticket._id);
        const oldUser = await this.userService.findOneFilter({
          assignedTickets: ticket._id,
        });
        if (oldUser) {
          oldUser.assignedTickets = oldUser.assignedTickets.filter(
            (item) => item !== ticket._id,
          );
          await oldUser.save();
        }
        await user.save();
      }
    }
    return ticket;
  }
}
