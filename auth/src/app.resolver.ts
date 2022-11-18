import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user/user.service';

@Resolver('User')
export class AppResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user);
  }

  @Mutation()
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const hash = await this.authService.validatePassword(password);
    const user = await this.userService.createUser({
      email,
      password: hash,
    });
    return user;
  }

  @ResolveReference()
  resolveReference({ id }: { __typename: string; id: number }) {
    return this.userService.user({ id });
  }
}
