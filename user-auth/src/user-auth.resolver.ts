// import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserAuthService } from './user-auth.service';
import { Auth } from './graphql';

@Resolver()
export class UserAuthResolver {
  constructor(private readonly userAuthService: UserAuthService) {}

  /** Login endpoint */
  @Query()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<Auth | undefined> {
    try {
      return await this.userAuthService.login(email, password);
    } catch (error) {
      console.log(error);
      if (error.name === 'ValidateError') {
        return error.message;
      }
    }
  }

  /** Signup endpoint */
  @Mutation()
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<Auth | undefined> {
    try {
      return await this.userAuthService.signup(email, password);
    } catch (error) {
      console.log(error);
      if (error.name === 'ValidateError') {
        return error.message;
      }
    }
  }
}
