import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateAssignedTicketDto {
  @ApiProperty({ example: 'the_id_of_an_admin : 601090e62036b13d4c514166' })
  @IsString()
  @IsNotEmpty()
  assignedTo: string;
}
