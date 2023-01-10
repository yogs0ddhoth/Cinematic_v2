import { Injectable } from '@nestjs/common';
import { v5 as uuidv5 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { namespace } from './constants';
import { Auth, User } from 'src/graphql';

@Injectable()
export class AuthService {
  #bcrypt = bcrypt;
  #uuidv5 = uuidv5;

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Generate a unique id string for each new user
   * @param email string: the email address of the user
   * @returns string: the unique id
   */
  generateUserId(email: string): string {
    return this.#uuidv5(email, namespace);
  }

  /**
   * Issue a JWT Auth for logged in user
   * @param User: the user data
   * @type User: { id: string; email: string }
   * @returns Promise: JWT Auth
   * @type Auth: { access_token: string }
   */
  async login({ id, email }: User): Promise<Auth> {
    const payload = { username: email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Validate email is not already in use
   * @param email string: the email address to validate
   * @returns void
   * @throws {Error} if email is already in use
   */
  async validateEmail(email: string) {
    const user = await this.userService.user({ email });
    if (user) {
      throw new Error('Email already in use');
    }
  }

  async validatePassword(password: string): Promise<string> {
    /** TODO: create cryptographically strong password requirements
     *   - length, characters
     *   - regex verification
     *   - throw an error for passwords that fail
     */
    return this.#bcrypt.hash(password, 12);
  }

  /**
   * Validate user credentials
   * @param email string: the email address of the user
   * @param password string: the password of the user
   * @returns Promise: the validated User
   * @type User: { id: string; email: string }
   * @throws {Error} if user does not exist or password is invalid
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.user({ email });
    if (!user) {
      throw new Error('User does not Exist.');
    }
    const { password: hash, ...userInfo } = user;

    if ((await this.verifyUser(password, hash)) == false) {
      throw new Error('Invalid Credentials!');
    }

    return userInfo;
  }

  /**
   * Verify password matches encrypted record
   * @param password string: the password to verify
   * @param userHash string: the encrypted password
   * @returns Promise: true if password matches, false if not
   */
  async verifyUser(password: string, userHash: string): Promise<boolean> {
    return this.#bcrypt.compare(password, userHash);
  }
}
