import { ApiProperty } from '@nestjs/swagger';
import { TicketStatusEnum } from '../enums/ticket-status.enum';
import { TicketTypeEnum } from '../enums/ticket-type.enum';
import { TicketPriorityEnum } from '../enums/ticket-priority.enum';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateTicketDto {
  @ApiProperty({ example: 'My ticket updated' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'This is my ticket updated' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: TicketStatusEnum })
  @IsString()
  @IsNotEmpty()
  @IsEnum(TicketStatusEnum)
  status: TicketStatusEnum;

  @ApiProperty({ enum: TicketTypeEnum })
  @IsString()
  @IsNotEmpty()
  @IsEnum(TicketTypeEnum)
  type: TicketTypeEnum;

  @ApiProperty({ enum: TicketPriorityEnum })
  @IsString()
  @IsNotEmpty()
  @IsEnum(TicketPriorityEnum)
  priority: TicketPriorityEnum;
}
