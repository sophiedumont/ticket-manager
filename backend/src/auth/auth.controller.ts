import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CredentialsDto } from './dto/credentials-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Sign In',
  })
  async login(@Body() credentialsDto: CredentialsDto, @Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
