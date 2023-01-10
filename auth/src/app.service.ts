import { Injectable } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { Auth, User } from './graphql';
import { UserService } from './user/user.service';

/**
 * Class containing services for Auth
 */
@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async login(email: string, password: string): Promise<Auth> {
    try {
      const user = await this.authService.validateUser(email, password);

      if (!user)
        throw new Error('Invalid Login Credentials', {
          cause: {
            value: { email, password },
          },
        });

      return this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }

  async signup(email: string, password: string): Promise<Auth> {
    try {
      await this.authService.validateEmail(email);
      const hash = await this.authService.validatePassword(password);

      // remove password from user object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...user } = await this.userService.createUser({
        id: this.authService.generateUserId(email),
        email,
        password: hash,
      });

      return this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }

  async resolveUser(id: string): Promise<User> {
    try {
      const user = await this.userService.user({ id });

      if (!user)
        throw new Error('User not found', {
          cause: {
            value: { id },
          },
        });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
