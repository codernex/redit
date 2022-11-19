import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export default class User {
  @Field(() => Int)
  @PrimaryKey()
  id: number;

  @Field(() => String)
  @Property({ type: 'text', unique: true })
  userName!: string;

  @Property({ type: 'text' })
  password!: string;

  @Field(() => String)
  @Property()
  createdAt?: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
