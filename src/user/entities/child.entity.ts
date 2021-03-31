import { SexType, User } from './user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsDate } from 'class-validator';
import { CoreEntity } from './../../common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('chlidEntity', { isAbstract: true })
@ObjectType()
@Entity()
export class Child extends CoreEntity {
  @Column()
  @Field(() => Date)
  @IsDate()
  birthday: Date;

  @Column({ type: 'enum', enum: SexType })
  @Field(() => SexType)
  @IsEnum(SexType)
  sex: SexType;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.children, { onDelete: 'CASCADE' })
  parent: User;
}
