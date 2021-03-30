import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hiNest(): string {
    return 'hi graphql';
  }
}
