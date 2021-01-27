import { Injectable } from '@nestjs/common';
import { Ticket } from '../tickets/schemas/ticket.schema';
import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';
import { User } from '../users/schemas/user.schema';
import { UpdateTicketDto } from '../tickets/dto/update-ticket.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateAssignedTicketDto } from '../tickets/dto/update-assigned-ticket.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class AdminService {
  constructor(
    private userService: UsersService,
    private ticketService: TicketsService,
  ) {}
  async findAllTickets(pagination: PaginationDto): Promise<Ticket[]> {
    return this.ticketService.findAll(pagination);
  }

  async findAllUsers(pagination: PaginationDto): Promise<User[]> {
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
}
