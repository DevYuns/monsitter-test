import { User } from './../entities/user.entity';
import { ObjectType, PickType, PartialType, InputType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';

@ObjectType()
export class UpdateProfileOutput extends CoreOutput {}

@InputType()
export class UpdateProfileInput extends PartialType(
  PickType(User, ['email', 'name']),
) {}
