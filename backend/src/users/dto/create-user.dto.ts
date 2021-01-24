import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'sophiedumont' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'sophie@dumont.com' })
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
