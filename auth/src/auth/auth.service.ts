import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  #bcrypt = bcrypt;
  constructor(private readonly userService: UserService) {}

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

  async verifyUser(password: string, userHash: string): Promise<boolean> {
    return this.#bcrypt.compare(password, userHash);
  }
}
