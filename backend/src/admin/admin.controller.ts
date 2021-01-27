import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Ticket } from '../tickets/schemas/ticket.schema';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { AdminService } from './admin.service';
import { User } from '../users/schemas/user.schema';
import { UpdateTicketDto } from '../tickets/dto/update-ticket.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateAssignedTicketDto } from '../tickets/dto/update-assigned-ticket.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAdminAuthGuard)
  @Get('tickets')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The list of Tickets',
    type: Ticket,
    isArray: true,
  })
  async findAllTickets(
    @Query('page') page: string = '0',
    @Query('resultsPerPage') resultsPerPage: string = '10',
  ): Promise<Ticket[]> {
    return this.adminService.findAllTickets({
      page: parseInt(page),
      resultsPerPage: parseInt(resultsPerPage),
    });
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('tickets/:id')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'One Ticket',
    type: Ticket,
    isArray: true,
  })
  async findOneTicket(@Param('id') id: string): Promise<Ticket> {
    try {
      const ticket = await this.adminService.findOneTicket(id);
      return ticket;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: ['Ticket not found'],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('users/:id')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'One Ticket',
    type: Ticket,
    isArray: true,
  })
  async findOneUser(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.adminService.findOneUser(id);
      return user;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: ['User not found'],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('users')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The list of Users',
    type: Ticket,
    isArray: true,
  })
  async findAllUsers(
    @Query('page') page: string = '0',
    @Query('resultsPerPage') resultsPerPage: string = '10',
  ): Promise<User[]> {
    return this.adminService.findAllUsers({
      page: parseInt(page),
      resultsPerPage: parseInt(resultsPerPage),
    });
  }

  @UseGuards(JwtAdminAuthGuard)
  @Put('users/:id')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update User info',
    type: User,
  })
  async updateOneUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.adminService.updateOneUser(
        id,
        updateUserDto,
      );
      return updatedUser;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: [err.message],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('tickets/assign/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Assign or update a user to a ticket',
    type: Ticket,
  })
  async updateAssignToTicket(
    @Param('id') id: string,
    @Body() updateAssignedTicketDto: UpdateAssignedTicketDto,
  ): Promise<Ticket> {
    try {
      const updatedTicket = await this.adminService.updateAssignedToTicket(
        id,
        updateAssignedTicketDto,
      );
      console.log({ updatedTicket });
      return updatedTicket;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: [err.message],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('tickets/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Modify the content of a Ticket',
    type: Ticket,
  })
  async updateOneTicketContent(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    try {
      const updatedTicket = await this.adminService.updateOneTicketContent(
        id,
        updateTicketDto,
      );
      return updatedTicket;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: [err.message],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
