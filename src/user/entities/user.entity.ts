import {
  ObjectType,
  InputType,
  registerEnumType,
  Field,
} from '@nestjs/graphql';
import { CoreEntity } from './../../common/entities/core.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsNumber,
  IsDate,
  Length,
} from 'class-validator';
import * as bcrypt from 'bcrypt';

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
  @IsNumber()
  MemberNumber: number;

  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column()
  @Field(() => Date)
  @IsDate()
  birthday: Date;

  @Column({ type: 'enum', enum: SexType })
  @Field(() => SexType)
  @IsEnum(SexType)
  sex: SexType;

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @Length(7)
  accountId: string;

  @Column()
  @Field(() => String)
  @IsString()
  @Length(7)
  password: string;

  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ type: 'enum', enum: UserRole, array: true })
  @Field(() => [UserRole])
  @IsEnum(UserRole)
  role: UserRole[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, this.password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
