import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @ApiProperty({ example: 'sophiedumont' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'toto123*toto' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
