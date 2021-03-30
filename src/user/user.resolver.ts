import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Resolver, Query } from '@nestjs/graphql';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => Boolean)
  hi() {
    return true;
  }
}
