import { Child } from './entities/child.entity';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User, Child])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
