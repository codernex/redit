import { MikroORM } from '@mikro-orm/core';
import { ApolloServer, CorsOptions } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import express from 'express';
import session from 'express-session';
import playground from 'graphql-playground-middleware-express';
import { createClient } from 'redis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import mikroOrmConfig from './mikro-orm.config';
import PostResolver from './resolver/post';
import UserResolver from './resolver/user';
const main = async () => {
  const app = express();

  app.get('/', playground({ endpoint: '/graphql' }));

  const redisClient = createClient({ legacyMode: true });
  await redisClient.connect();
  const RedisStore = connectRedis(session);
  const cors: CorsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    exposedHeaders: ['Set-Cookie', 'connection']
  };
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient, disableTTL: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      },
      saveUninitialized: false,
      secret: 'keyboardcaxt',
      resave: false
    })
  );

  const orm = await MikroORM.init(mikroOrmConfig);

  await orm.getMigrator().up();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ em: orm.em.fork(), req, res })
  });

  await server.start();

  server.applyMiddleware({ app, cors });
  app.listen(5000, () => {
    console.log(`✈️ Server Running On Port : 4000
    
    Graphql Running On http://localhost:5000/graphql
    `);
  });
};

main().catch(err => console.error(err));
