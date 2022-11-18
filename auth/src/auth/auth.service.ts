import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  #bcrypt = bcrypt;
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validatePassword(password: string): Promise<string> {
    return this.#bcrypt.hash(password, 12);
  }

  async validateUser(email: string, password: string) {
    const { password: hash, ...user } = await this.userService.user({ email });

    if (await this.verifyUser(password, hash)) {
      return user;
    }

    return null;
  }

  async login({ id, email }: any) {
    const payload = { username: email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyUser(password: string, userHash: string): Promise<boolean> {
    return this.#bcrypt.compare(password, userHash);
  }
}
