import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Post,
  Query,
  Res,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Ticket } from '../tickets/schemas/ticket.schema';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { AdminService } from './admin.service';
import { User } from '../users/schemas/user.schema';
import { UpdateTicketDto } from '../tickets/dto/update-ticket.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateAssignedTicketDto } from '../tickets/dto/update-assigned-ticket.dto';
import { PageDto } from '../dto/page.dto';
import { schemaToAdminDto } from './dto/admin-response.dto';
import { CreateTicketDto } from '../tickets/dto/create-ticket.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

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
  @Header('Access-Control-Expose-Headers', 'Content-Range')
  async findAllTickets(@Res() res: Response, @Query() pageDto: PageDto) {
    const [tickets, total, range] = await this.adminService.findAllTickets(
      pageDto,
    );
    const header = 'tickets ' + range + '/' + total;
    res.setHeader('Content-Range', header);
    return res.json(tickets.map((t) => schemaToAdminDto(t)));
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
  async findOneTicket(@Param('id') id: string): Promise<any> {
    try {
      const ticket = await this.adminService.findOneTicket(id);
      return schemaToAdminDto(ticket);
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
  async findOneUser(@Param('id') id: string): Promise<any> {
    try {
      const user = await this.adminService.findOneUser(id);
      return schemaToAdminDto(user);
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
    type: User,
    isArray: true,
  })
  @Header('Access-Control-Expose-Headers', 'Content-Range')
  async findAllUsers(@Res() res: Response, @Query() pageDto: PageDto) {
    try {
      const [users, total, range] = await this.adminService.findAllUsers(
        pageDto,
      );
      const header = 'users ' + range + '/' + total;
      res.setHeader('Content-Range', header);
      return res.json(users.map((t) => schemaToAdminDto(t)));
    } catch (e) {
      console.log(e);
      return res.json([]);
    }
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
      return schemaToAdminDto(updatedUser);
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

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
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

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
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
  ): Promise<any> {
    try {
      const updatedTicket = await this.adminService.updateOneTicketContent(
        id,
        updateTicketDto,
      );
      return schemaToAdminDto(updatedTicket);
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

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @Post('tickets')
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Create a new ticket',
    type: Ticket,
  })
  async createOneTicket(
    @Request() req,
    @Body() createTicketDto: CreateTicketDto,
  ): Promise<any> {
    try {
      const createdTicket = await this.adminService.createOneTicket(
        req.user.id,
        createTicketDto,
      );
      return schemaToAdminDto(createdTicket);
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

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @Post('users')
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Create a new user',
    type: Ticket,
  })
  async createOneUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const createdUser = await this.adminService.createOneUser(createUserDto);
      return schemaToAdminDto(createdUser);
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

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @Delete('users/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete an user',
    type: Ticket,
  })
  async deleteOneUser(@Param('id') id: string): Promise<any> {
    try {
      const removedUser = await this.adminService.deleteOneUser(id);
      return schemaToAdminDto(removedUser);
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

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @Delete('tickets/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: Ticket,
    description: 'Delete a Ticket',
  })
  async deleteOneTicket(@Param('id') id: string): Promise<any> {
    try {
      const removedTicket = await this.adminService.deleteOneTicket(id);
      return schemaToAdminDto(removedTicket);
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
}
