import {
  ObjectType,
  InputType,
  registerEnumType,
  Field,
} from '@nestjs/graphql';
import { CoreEntity } from './../../common/entities/core.entity';
import { Entity, Column } from 'typeorm';

enum SexType {
  male = 'MALE',
  female = 'FEMALE',
}
enum UserRole {
  parent = 'PARENT',
  sitter = 'SITTER',
}

registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(SexType, { name: 'SexType' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  //TODO: 유니크 키로 자동 생성되로록 바꾸기
  @Column({ default: 12345 })
  @Field(() => Number)
  MemberNumber: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Date)
  birthday: Date;

  @Column({ type: 'enum', enum: SexType })
  @Field(() => SexType)
  sex: SexType;

  @Column({ unique: true })
  @Field(() => String)
  accountId: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ type: 'enum', enum: UserRole, array: true })
  @Field(() => [UserRole])
  role: UserRole[];
}
