import { Injectable } from '@nestjs/common';
import { v5 as uuidv5 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { namespace } from './constants';

@Injectable()
export class AuthService {
  #bcrypt = bcrypt;
  #uuidv5 = uuidv5;

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validatePassword(password: string): Promise<string> {
    /** TODO: create cryptographically strong password requirements
     *   - length, characters
     *   - regex verification
     */
    return this.#bcrypt.hash(password, 12);
  }

  /** generate a unique id string for each new user */
  generateUserId(email: string): string {
    return this.#uuidv5(email, namespace);
  }

  /** validate authentication */
  async validateUser(email: string, password: string) {
    const { password: hash, ...user } = await this.userService.user({ email });

    if (await this.verifyUser(password, hash)) {
      return user;
    }

    return null;
  }

  /** issue a jwt for logged in user */
  async login({ id, email }: { id: string; email: string }) {
    const payload = { username: email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /** verify password matches encrypted record */
  async verifyUser(password: string, userHash: string): Promise<boolean> {
    return this.#bcrypt.compare(password, userHash);
  }
}
