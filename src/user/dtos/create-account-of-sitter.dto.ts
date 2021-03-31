import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';
import { PickType, ObjectType, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccountOfSitterInput extends PickType(User, [
  'birthday',
  'email',
  'name',
  'password',
  'roles',
  'gender',
  'accountId',
  'careRange',
  'sitterDescription',
]) {}

@ObjectType()
export class CreateAccountOfSitterOutput extends CoreOutput {}
