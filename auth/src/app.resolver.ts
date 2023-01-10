// import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AppService } from './app.service';
import { Auth } from './graphql';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  /** Login endpoint */
  @Query()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<Auth | undefined> {
    try {
      return await this.appService.login(email, password);
    } catch (error) {
      console.log(error);
    }
  }

  /** Signup endpoint */
  @Mutation()
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<Auth | undefined> {
    try {
      return await this.appService.signup(email, password);
    } catch (error) {
      console.log(error);
    }
  }
}
