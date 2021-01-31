import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  HttpException,
  HttpCode,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './schemas/ticket.schema';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PageDto } from '../dto/page.dto';
import { schemaToAdminDto } from '../admin/dto/admin-response.dto';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a new ticket',
    type: Ticket,
  })
  async create(
    @Request() req,
    @Body() createTicketDto: CreateTicketDto,
  ): Promise<any> {
    try {
      const ticket = await this.ticketsService.createWithCreator(
        req.user,
        createTicketDto,
      );
      return schemaToAdminDto(ticket);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: ['Ticket not created'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The list of my Tickets',
    type: Ticket,
    isArray: true,
  })
  async findAllTickets(@Request() req, @Query() pageDto: PageDto) {
    const [
      tickets,
      total,
      range,
    ] = await this.ticketsService.findAllWithCreator(req.user.id, pageDto);
    const header = 'tickets ' + range + '/' + total;
    return tickets.map((t) => schemaToAdminDto(t));
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'A specific ticket',
    type: Ticket,
  })
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const ticket = await this.ticketsService.findOne(id);
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
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
      const updatedTicket = await this.ticketsService.update(
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

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Remove a ticket',
  })
  async deleteOneTicket(@Param('id') id: string) {
    try {
      await this.ticketsService.findOneAndDelete(id);
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
