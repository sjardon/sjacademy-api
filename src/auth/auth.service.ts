import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    const { password: hashPassword } = user;

    if (hashPassword) {
      const match = await bcrypt.compare(password, hashPassword);

      if (match) {
        return user;
      }
    }

    return false;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user._id };
    const auth = new Auth();
    auth.access_token = this.jwtService.sign(payload);

    return auth;
  }
}
