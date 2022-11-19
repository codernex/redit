import Post from '../entities/Post';
import { Resolver, Query, Ctx, Mutation, Arg } from 'type-graphql';
import { MyContext } from 'src/types';

@Resolver()
export default class PostResolver {
  @Query(() => [Post])
  post(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });

    await em.persistAndFlush(post);

    return post;
  }
}
