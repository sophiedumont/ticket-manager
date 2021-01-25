import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { TicketsService } from '../tickets/tickets.service';

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
      throw 'User already exists';
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) throw 'User not found';
    return user;
  }

  async findOneWithTickets(id: string): Promise<User> {
    const user = await this.findOne(id, 'createdTickets');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = this.userModel.updateOne({ _id: id }, updateUserDto);
    if (!updatedUser) {
      throw 'User not found';
    }
    return updatedUser;
  }

  async updateDocument(id: string, user: Partial<User>): Promise<User> {
    const updatedUser = this.userModel.updateOne({ _id: id }, user);
    if (!updatedUser) {
      throw 'User not found';
    }
    return updatedUser;
  }

  async findOne(id: string, populate = ''): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: id })
      .populate(populate)
      .exec();
    if (!user) throw 'User not found';
    return user;
  }
}
