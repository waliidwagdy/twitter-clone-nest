import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsResolver } from './records.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Record]), UsersModule],
  providers: [RecordsService, RecordsResolver]
})
export class FollowersModule { }
