// import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, ResolveReference } from '@nestjs/graphql';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user/user.service';

@Resolver('User')
export class AppResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /** Login endpoint */
  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
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
      console.log(error);
      return error;
    }
  }

  /** Signup endpoint */
  @Mutation()
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    try {
      const hash = await this.authService.validatePassword(password);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...user } = await this.userService.createUser({
        id: this.authService.generateUserId(email),
        email,
        password: hash,
      });

      return this.authService.login(user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // TODO: protect route with passport jwt
  @ResolveReference()
  resolveReference({ email }: { __typename: string; email: string }) {
    return this.userService.user({ email });
  }
}
