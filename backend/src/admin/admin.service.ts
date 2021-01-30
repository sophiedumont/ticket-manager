import { Injectable } from '@nestjs/common';
import { Ticket } from '../tickets/schemas/ticket.schema';
import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';
import { User } from '../users/schemas/user.schema';
import { UpdateTicketDto } from '../tickets/dto/update-ticket.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateAssignedTicketDto } from '../tickets/dto/update-assigned-ticket.dto';
import { PageDto } from '../dto/page.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateTicketDto } from '../tickets/dto/create-ticket.dto';

@Injectable()
export class AdminService {
  constructor(
    private userService: UsersService,
    private ticketService: TicketsService,
  ) {}
  async findAllTickets(
    pagination: PageDto,
  ): Promise<[Ticket[], number, string]> {
    return this.ticketService.findAll(pagination);
  }

  async findAllUsers(pagination: PageDto): Promise<[User[], number, string]> {
    return this.userService.findAll(pagination);
  }

  async findOneTicket(id: string): Promise<Ticket> {
    return this.ticketService.findOne(id);
  }

  async findOneUser(id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  async updateOneTicketContent(
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketService.update(id, updateTicketDto);
  }

  async updateAssignedToTicket(
    id: string,
    updateAssignedTicketDto: UpdateAssignedTicketDto,
  ): Promise<Ticket> {
    const assignedTo = await this.userService.findOneAdmin(
      updateAssignedTicketDto.assignedTo,
    );
    console.log({ assignedTo });
    return this.ticketService.updateDocument(id, { assignedTo: assignedTo });
  }

  async updateOneUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  async createOneUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  async createOneTicket(
    userId: string,
    createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    console.log('toto');
    console.log({ userId });
    return this.ticketService.createWithCreator(userId, createTicketDto);
  }

  async deleteOneUser(id: string): Promise<User> {
    return this.userService.findOneAndDelete(id);
  }

  async deleteOneTicket(id: string): Promise<Ticket> {
    return this.ticketService.findOneAndDelete(id);
  }
}
