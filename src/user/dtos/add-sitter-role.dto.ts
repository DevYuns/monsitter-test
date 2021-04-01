import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';
import { PickType, ObjectType, InputType } from '@nestjs/graphql';

@InputType()
export class AddSitterRoleInput extends PickType(User, [
  'sitterDescription',
  'careRange',
]) {}

@ObjectType()
export class AddSitterRoleOutput extends CoreOutput {}
