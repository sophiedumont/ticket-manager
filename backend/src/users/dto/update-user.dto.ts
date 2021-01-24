import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'nicolasdumont' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'nicolas@dumont.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'toto123*toto' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Your Password should be at least 8 characters' })
  password: string;
}
