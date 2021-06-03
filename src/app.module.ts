import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TweetsModule } from './tweets/tweets.module';
import { UsersModule } from './users/users.module';
import { FollowersModule } from './records/records.module';

@Module({
  imports: [GraphQLModule.forRoot({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    context: ({ req }) => ({ header: req.headers }),
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'host',
    port: 5432,
    username: 'username',
    password: 'password',
    database: 'database',
    url: 'dataabse url',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
    TweetsModule,
    UsersModule,
    FollowersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
