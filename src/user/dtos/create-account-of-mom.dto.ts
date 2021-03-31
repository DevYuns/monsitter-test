import { Child } from './../entities/child.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';
import { PickType, ObjectType, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccountOfMomInput extends PickType(User, [
  'birthday',
  'email',
  'name',
  'password',
  'roles',
  'gender',
  'accountId',
  'parentDescription',
]) {}

@InputType()
export class ChildrenInput extends PickType(Child, ['birthday', 'gender']) {}

@ObjectType()
export class CreateAccountOfMomOutput extends CoreOutput {}
