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
    host: 'ec2-63-34-97-163.eu-west-1.compute.amazonaws.com',
    port: 5432,
    username: 'aotsdntvelzmni',
    password: 'ab714eacf13a68b824b199fe81abe01ee857681f35c4cee2c87fbbfb37e05259',
    database: 'd8r3vl8dblqt3h',
    url: 'postgres://aotsdntvelzmni:ab714eacf13a68b824b199fe81abe01ee857681f35c4cee2c87fbbfb37e05259@ec2-63-34-97-163.eu-west-1.compute.amazonaws.com:5432/d8r3vl8dblqt3h',
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
