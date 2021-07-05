import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '~/user/user.interface';
import { UserService } from '~/user/user.service';
import { LoginResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email, {
      email: 1,
      name: 1,
      password: 1,
    });

    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) {
      return null;
    }

    return { _id: user._id, email: user.email, name: user.name };
  }

  async login(user: User): Promise<LoginResponse> {
    const payload = { sub: user._id.toString() };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '3600s' }),
    };
  }
}
