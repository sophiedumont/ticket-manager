import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  resultsPerPage: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  page: number;
}
