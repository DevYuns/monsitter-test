import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';
import { PickType, ObjectType, InputType } from '@nestjs/graphql';

@InputType()
export class AddParentRoleInput extends PickType(User, [
  'parentDescription',
  'children',
]) {}

@ObjectType()
export class AddParentRoleOutput extends CoreOutput {}
