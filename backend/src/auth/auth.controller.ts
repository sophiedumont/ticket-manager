import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  HttpCode,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
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
    return this.authService.login(req.user);
  }
}
