import { Child } from './../entities/child.entity';
import { ObjectType, PartialType, InputType, PickType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';

@InputType()
export class UpdateChildInfoInput extends PartialType(
  PickType(Child, ['birthday', 'gender']),
) {}

@ObjectType()
export class UpdateChildInfoOutput extends CoreOutput {}
