import { User } from './user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { IsEnum, IsDate } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { GenderType } from './../entities/user.entity';
import { ObjectType, InputType, Field } from '@nestjs/graphql';

@InputType('ChildEntity', { isAbstract: true })
@ObjectType()
@Entity()
export class Child extends CoreEntity {
  @Column()
  @IsDate()
  @Field(() => Date)
  birthday: Date;

  @Column({ type: 'enum', enum: GenderType })
  @Field(() => GenderType)
  @IsEnum(GenderType)
  gender: GenderType;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.children, { onDelete: 'CASCADE' })
  parent: User;
}
