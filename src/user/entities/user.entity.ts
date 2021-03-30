import { ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
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
  @Column()
  MemberNumber: number;

  @Column()
  name: string;

  @Column()
  birthday: Date;

  @Column({ type: 'enum', enum: SexType })
  sex: SexType;

  @Column()
  userId: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserRole, array: true })
  role: UserRole[];
}
