import { User } from './../entities/user.entity';
import { ObjectType, PickType, PartialType, InputType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';

@InputType()
export class UpdateProfileInput extends PartialType(
  PickType(User, [
    'email',
    'name',
    'careRange',
    'children',
    'parentDescription',
    'sitterDescription',
    'careRange',
  ]),
) {}

@ObjectType()
export class UpdateProfileOutput extends CoreOutput {}
