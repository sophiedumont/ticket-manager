import { FilterQuery, Model, Schema } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { TicketsService } from '../tickets/tickets.service';
import { PageDto } from '../dto/page.dto';
import { Ticket, TicketDocument } from '../tickets/schemas/ticket.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => TicketsService))
    private ticketsService: TicketsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return createdUser.save();
    } catch (err) {
      throw { message: 'User already exists' };
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) throw { message: 'User not found' };
    return user;
  }

  async findOneFilter(filter?: FilterQuery<User>): Promise<UserDocument> {
    return this.userModel.findOne(filter).exec();
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

  async findAll(page: PageDto): Promise<[User[], number, string]> {
    try {
      const filters = JSON.parse(page.filter || '{}');
      const range = page.sort ? JSON.parse(page.range) : [0, 9];
      const limit = range[1] + 1 - range[0];
      const skip = range[0];
      const sort = page.sort ? JSON.parse(page.sort) : ['username', 'desc'];
      const count = await this.findAllAndCount();
      const users = await this.userModel
        .find(this.convert(filters))
        .limit(limit)
        .skip(skip)
        .sort({ [sort[0]]: sort[1] })
        .exec();
      return [users, count, range.join('-')];
    } catch (e) {
      console.log(e);
      throw 'Users not found';
    }
  }

  async findOneAndDelete(id: string): Promise<User> {
    const removedUser = await this.userModel.findOneAndDelete({ _id: id });
    if (!removedUser) {
      throw { message: 'User not found' };
    }
    await this.removeAllReferencesInTickets(removedUser);
    return removedUser;
  }

  async removeAllReferencesInTickets(user: UserDocument): Promise<void> {
    const ticketsAssigned = await this.findTicketsUserReference(
      user,
      'assignedTickets',
    );
    if (ticketsAssigned && ticketsAssigned.length > 0) {
      for (const ticket of ticketsAssigned) {
        ticket.assignedTo = null;
        await this.ticketsService.save(ticket, true);
      }
    }
    const ticketCreated = await this.findTicketsUserReference(
      user,
      'createdTickets',
    );
    if (ticketCreated && ticketCreated.length > 0) {
      for (const ticket of ticketCreated) {
        ticket.creator = null;
        await this.ticketsService.save(ticket, true);
      }
    }
  }
  async findTicketsUserReference(
    user: UserDocument,
    ref: string,
  ): Promise<TicketDocument[]> {
    let tickets;
    if (user.populated[ref]) {
      tickets = user[ref] as TicketDocument[];
    } else if (user[ref].length > 0) {
      const refIds = user[ref] as mongoose.Schema.Types.ObjectId[];
      tickets = await this.ticketsService.findFilter({ _id: { $in: refIds } });
    }
    return tickets;
  }

  async findAllAndCount(): Promise<number> {
    return this.userModel.find().count().exec();
  }

  async findOneWithTickets(id: string): Promise<User> {
    const user = await this.findOne(id, 'createdTickets');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = this.userModel.findByIdAndUpdate(id, updateUserDto);
    if (!updatedUser) {
      throw { message: 'User not found' };
    }
    return updatedUser;
  }

  async updateDocument(id: string, user: Partial<User>): Promise<User> {
    const updatedUser = this.userModel.findByIdAndUpdate(id, user);
    if (!updatedUser) {
      throw { message: 'User not found' };
    }
    return updatedUser;
  }

  async findOne(id: string, populate = ''): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: id })
      .populate(populate)
      .exec();
    if (!user) throw { message: 'User not found' };
    return user;
  }

  async findOneAdmin(id: string, populate = ''): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: id, isAdmin: true })
      .populate(populate)
      .exec();
    if (!user) throw { message: 'Admin not found' };
    return user;
  }
}
