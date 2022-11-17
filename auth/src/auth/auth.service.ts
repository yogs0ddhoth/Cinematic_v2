import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  #bcrypt = bcrypt;

  async validatePassword(password: string): Promise<string> {
    return this.#bcrypt.hash(password, 12);
  }

  async verifyUser(password: string, userHash: string): Promise<boolean> {
    return this.#bcrypt.compare(password, userHash);
  }
}
