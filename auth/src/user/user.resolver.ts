import { Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private usersService: UserService) {}

  @Query()
  getUser() {

  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {
  }
}