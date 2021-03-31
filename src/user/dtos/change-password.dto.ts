import { User } from './../entities/user.entity';
import { ObjectType, PickType, InputType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';

@InputType()
export class ChangePasswordInput extends PickType(User, ['password']) {}
@ObjectType()
export class ChangePasswordOutput extends CoreOutput {}
