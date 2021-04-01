import { validatePassword } from './../../utils/validate-password';
import { Child } from './child.entity';
import {
  ObjectType,
  InputType,
  registerEnumType,
  Field,
} from '@nestjs/graphql';
import { CoreEntity } from './../../common/entities/core.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsNumber,
  IsDate,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import * as bcrypt from 'bcrypt';

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum UserRole {
  PARENT = 'PARENT',
  SITTER = 'SITTER',
}

enum CareRange {
  INFANT = 'INFANT',
  CHILD = 'CHILD',
  SCHOOL = 'SCHOOL',
}

registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(GenderType, { name: 'GenderType' });
registerEnumType(CareRange, { name: 'CareRange' });

@InputType('UserEntity', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(() => Number)
  @IsNumber()
  memberNumber: number;

  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column()
  @Field(() => Date)
  @IsDate()
  birthday: Date;

  @Column({ type: 'enum', enum: GenderType })
  @Field(() => GenderType)
  @IsEnum(GenderType)
  gender: GenderType;

  @Column({ unique: true })
  @Field(() => String)
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  accountId: string;

  @Column()
  @Field(() => String)
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  password: string;

  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ type: 'enum', enum: UserRole, array: true })
  @Field(() => [UserRole])
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @OneToMany(() => Child, (child) => child.parent, { nullable: true })
  @Field(() => [Child], { nullable: true })
  children?: Child[];

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  parentDescription: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sitterDescription: string;

  @Column({ type: 'enum', enum: CareRange, array: true, nullable: true })
  @Field(() => [CareRange])
  @IsEnum(CareRange, { each: true })
  @IsOptional()
  careRange: CareRange[];

  @BeforeInsert()
  @BeforeUpdate()
  async validateAndHashPassword(): Promise<void> {
    try {
      const isValidateChecked = validatePassword(this.password);

      if (isValidateChecked) {
        this.password = await bcrypt.hash(this.password, 10);
      } else {
        throw Error('password must be with alphabet and number');
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @BeforeInsert()
  generateMemberNumber(): void {
    this.memberNumber = Math.floor(Math.random() * 100);
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
