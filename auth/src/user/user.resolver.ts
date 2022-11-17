import { Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  getUser() {
    return this.userService.user({ id: 1 });
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {}
}