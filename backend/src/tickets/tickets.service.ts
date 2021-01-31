import { FilterQuery, Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
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
    if (!createdTicket) throw 'Ticket not created';
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

  convert(filter: any) {
    const returnedObj = {};

    for (const attr in filter) {
      if (Array.isArray(filter[attr])) {
        returnedObj[attr === '_id' ? 'id' : attr] = { $in: filter[attr] };
      } else {
        returnedObj[attr] = filter[attr];
      }
    }
    return returnedObj;
  }

  async findAll(page: PageDto): Promise<[Ticket[], number, string]> {
    try {
      const filters = JSON.parse(page.filter || '{}');
      const range = page.sort ? JSON.parse(page.range) : [0, 9];
      const limit = range[1] + 1 - range[0];
      const skip = range[0];
      const sort = page.sort ? JSON.parse(page.sort) : ['createdAt', 'desc'];
      const count = await this.findAllAndCount();
      const tickets = await this.ticketModel
        .find(this.convert(filters))
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

  async findOneFilter(filter?: FilterQuery<User>): Promise<TicketDocument> {
    return this.ticketModel.findOne(filter).exec();
  }
  async findFilter(filter?: FilterQuery<User>): Promise<TicketDocument[]> {
    return this.ticketModel.find(filter).exec();
  }

  async findOneWithCreator(id: string): Promise<Ticket> {
    return this.ticketModel.findOne({ _id: id }).populate('creator').exec();
  }

  async findAllWithCreator(
    id: string,
    page: PageDto,
  ): Promise<[Ticket[], number, string]> {
    try {
      const range = page.sort ? JSON.parse(page.range) : [0, 9];
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
      console.log(e);
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
      const updatedTicket = await this.updateDocument(id, updateTicketDto);
      return updatedTicket;
    } else {
      throw { message: 'You are not allowed to update this ticket' };
    }
  }*/

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const updatedTicket = this.updateDocument(id, updateTicketDto);
    return updatedTicket;
  }

  async findOneAndDelete(id: string): Promise<Ticket> {
    const removedTicket = await this.ticketModel
      .findOneAndDelete({ _id: id })
      .exec();
    if (!removedTicket) {
      throw { message: 'Ticket not found' };
    }
    await this.removeAllReferencesInTicket(removedTicket);
    return removedTicket;
  }

  async updateDocument(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
    const ticketFound = await this.findOne(id);
    if (!ticketFound) {
      throw { message: 'Ticket not found' };
    }
    const ticketDoc = this.mergeDocumentsBeforeUpdate(ticketFound, ticket);
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

  async removeAllReferencesInTicket(ticket: TicketDocument): Promise<void> {
    await this.removeTicketRefFromUser(ticket, 'assignedTickets');
    await this.removeTicketRefFromUser(ticket, 'createdTickets');
  }
  async findTicketUserReference(
    ticket: TicketDocument,
    ref: string,
  ): Promise<UserDocument> {
    let user;
    if (ticket.populated[ref]) {
      user = ticket[ref] as UserDocument;
    } else if (ObjectId.isValid(ticket[ref] as string)) {
      const refId = ticket[ref] as string;
      user = await this.userService.findOne(refId);
    }
    return user;
  }
  async assignTicketToUserRef(
    ticket: TicketDocument,
    user: UserDocument,
    ref: string,
  ): Promise<User> {
    let savedUser = user;
    if (user) {
      if (!user[ref].some((t) => t.toString() === ticket._id.toString())) {
        user[ref].push(ticket._id);
        savedUser = await user.save();
      }
    }
    return savedUser;
  }
  async removeTicketRefFromUser(
    ticket: TicketDocument,
    ref: string,
  ): Promise<User> {
    const oldAssignedUser = await this.userService.findOneFilter({
      [ref]: ticket._id,
    });
    let savedUser = oldAssignedUser;
    if (oldAssignedUser) {
      oldAssignedUser[ref] = oldAssignedUser[ref].filter(
        (item) => item.toString() !== ticket._id.toString(),
      );
      savedUser = await oldAssignedUser.save();
    }
    return savedUser;
  }

  async save(ticketToSave: TicketDocument, noRefCheck = false) {
    const ticket = await ticketToSave.save();
    if (noRefCheck) {
      return ticket;
    }
    const creator = await this.findTicketUserReference(ticket, 'creator');
    const userAssignedTo = await this.findTicketUserReference(
      ticket,
      'assignedTo',
    );
    await this.removeTicketRefFromUser(ticket, 'assignedTickets');
    await this.assignTicketToUserRef(ticket, creator, 'createdTickets');
    await this.assignTicketToUserRef(ticket, userAssignedTo, 'assignedTickets');
    return ticket;
  }
}
