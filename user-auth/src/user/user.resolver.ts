import { Resolver, ResolveReference } from '@nestjs/graphql';
import { User } from 'src/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<User | undefined> {
    const { id } = reference;
    try {
      const user = await this.userService.user({ id: id });

      if (!user)
        throw new Error('User not found', {
          cause: {
            value: { id },
          },
        });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
