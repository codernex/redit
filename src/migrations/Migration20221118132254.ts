import { Migration } from '@mikro-orm/migrations';

export class Migration20221118132254 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "session" cascade;');

    this.addSql('alter table "user" drop constraint "user_email_unique";');
    this.addSql('alter table "user" drop column "email";');
  }

  async down(): Promise<void> {
    this.addSql('create table "session" ("sid" varchar not null default null, "sess" json not null default null, "expire" timestamp not null default null, constraint "session_pkey" primary key ("sid"));');
    this.addSql('create index "IDX_session_expire" on "session" ("expire");');

    this.addSql('alter table "user" add column "email" varchar not null default null;');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
