import { MikroORM } from '@mikro-orm/postgresql';
import path from 'path';
import { __prod__ } from './constant';
import Post from './entities/Post';
import User from './entities/User';

export default {
  user: 'postgres',
  password: '5105',
  dbName: 'redit',
  type: 'postgresql',
  debug: !__prod__,
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, './migrations'),
    glob: '*.ts'
  }
} as Parameters<typeof MikroORM.init>[0];
