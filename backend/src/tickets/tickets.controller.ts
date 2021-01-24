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
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './schemas/ticket.schema';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a new ticket',
    type: Ticket,
  })
  async create(@Body() createTicketDto: CreateTicketDto): Promise<Ticket> {
    try {
      const ticket = await this.ticketsService.create(createTicketDto);
      return ticket;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: ['Ticket not created'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The list of Tickets',
    type: Ticket,
    isArray: true,
  })
  async findAll(): Promise<Ticket[]> {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'A specific ticket',
    type: Ticket,
  })
  async findOne(@Param('id') id: string): Promise<Ticket> {
    try {
      const ticket = await this.ticketsService.findOne(id);
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

  @Put(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Modify a Ticket',
    type: Ticket,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateTicketDto,
  ): Promise<Ticket> {
    try {
      const updatedTicket = await this.ticketsService.update(id, updateUserDto);
      return updatedTicket;
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

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Remove a ticket',
  })
  async remove(@Param('id') id: string) {
    try {
      await this.ticketsService.remove(id);
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
