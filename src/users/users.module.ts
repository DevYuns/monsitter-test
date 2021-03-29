import { UserResolver } from './users.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [UserResolver],
})
export class UsersModule {}
