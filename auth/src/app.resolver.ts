// import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, ResolveReference } from '@nestjs/graphql';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AppService } from './app.service';

@Resolver('User')
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  /** Login endpoint */
  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
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
  ) {
    try {
      return await this.appService.signup(email, password);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Entity resolvers
   */
  @ResolveReference()
  async resolveReference({
    key,
    __typename,
  }: {
    __typename: string;
    key: string;
  }) {
    try {
      if (__typename === 'User') {
        // Resolve 'User' entity
        return await this.appService.findUserByID(key);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
