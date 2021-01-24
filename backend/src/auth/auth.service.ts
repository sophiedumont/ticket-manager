import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './dto/credentials-dto';
import { audit } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      throw 'Wrong credentials provided';
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
