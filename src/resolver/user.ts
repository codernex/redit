import argon from 'argon2';
import { MyContext } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql';
import User from '../entities/User';

@InputType()
class UserInput {
  @Field()
  userName: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export default class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    console.log(req.session.userId);
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    const users = em.find(User, {});
    return users;
  }

  @Query(() => User)
  user(
    @Arg('id', { nullable: false }) id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { id });
  }

  @Mutation(() => User, { nullable: true })
  async createUser(
    @Arg('options') options: UserInput,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    const hashedPwd = await argon.hash(options.password);

    const user = em.create(User, {
      userName: options.userName,
      password: hashedPwd
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === '23505') {
        console.log('User Already Exist');
        return null;
      }
    }
    return user;
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg('options') options: UserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    Object.defineProperty(req, 'secure', {
      value: true
    }); //For setting secure
    const user = await em.findOne(User, { userName: options.userName });

    if (!user) {
      return {
        errors: [{ field: 'username', message: 'User Not Exist' }]
      };
    }

    const valid = await argon.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [{ field: 'password', message: "password dosen't match" }]
      };
    }

    req.session.userId = user.id;

    return {
      user
    };
  }
}
