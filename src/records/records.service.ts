import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './record.entity';
import { UsersService } from '../users/users.service';
import { CreateRecordInput } from './dto/create-records.input';
import { User } from '../users/user.entity';
import { Pagination } from '../paginationDTO/pagination.input';
import { GetFollowers } from './dto/getfollwers.inputs';

@Injectable()
export class RecordsService {
    constructor(@InjectRepository(Record) private RecordRepository: Repository<Record>, private usersService: UsersService) { }

    async addRecord(createRecordInput: CreateRecordInput): Promise<Record> {
        //check for user existance
        const user = await this.usersService.findByIds([createRecordInput.followedId, createRecordInput.followerId]);
        if (user.length < 2) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        //check if that was an old record
        const isOld = await this.RecordRepository.find({
            where:
                [{
                    followerId: createRecordInput.followerId,
                    followedId: createRecordInput.followedId
                }, {
                    followedId: createRecordInput.followerId,
                    followerId: createRecordInput.followedId
                }]
        });
        if (isOld.length > 0) {
            throw new HttpException("Record already exists", HttpStatus.FORBIDDEN);
        }
        //check for not setting follower and followed with the same id
        if (createRecordInput.followerId === createRecordInput.followedId) {
            throw new HttpException("Can't be the same Ids.", HttpStatus.FORBIDDEN);
        }
        const newRecord = this.RecordRepository.create(createRecordInput);
        return await this.RecordRepository.save(newRecord);
    }

    async findAll(pagination: Pagination): Promise<Record[]> {
        //pagination logic
        if (!pagination.page) {
            pagination.page = 1;
        }
        return await this.RecordRepository.find({
            order: {
                id: 'ASC'
            },
            skip: (pagination.page - 1) * pagination.perPage,
            take: pagination.perPage
        });
    }


    async getFollowings(getFollowers: GetFollowers): Promise<User[]> {
        if (!getFollowers.page) {
            getFollowers.page = 1;
        }
        const records = await this.RecordRepository.find({
            where: { followerId: getFollowers.id },
            order: { id: 'DESC' },
            skip: (getFollowers.page - 1) * getFollowers.perPage,
            take: getFollowers.perPage
        });//extract the rows holding followedId : id => followings of a user that he is follower o
        let followeredsId = [...records].map(ele => {
            return ele.followedId;
        });
        // we map each element of the array of records to get the followings
        //we fetch users from DB with Ids we extracted
        const users = await this.usersService.findByIds(followeredsId);
        return users;
    }

    async getFollowers(getFollowers: GetFollowers): Promise<User[]> {
        if (!getFollowers.page) {
            getFollowers.page = 1;
        }
        const records = await this.RecordRepository.find({
            where: { followedId: getFollowers.id },
            order: { id: 'ASC' },
            skip: (getFollowers.page - 1) * getFollowers.perPage,
            take: getFollowers.perPage
        });//extract the rows holding followerId : id => followers of a user is who followed him
        let followersId = [...records].map(ele => {
            return ele.followerId;
        });
        // we map each element of the array of records to get the followers
        //we fetch users from DB with Ids we extracted
        const users = await this.usersService.findByIds(followersId);
        return users;
    }
    async getFollowersCount(userId: number): Promise<number> {
        const records = await this.RecordRepository.find({ where: { followedId: userId } });
        const followersCount = [...records].map(ele => {
            return ele.followerId;
        }).length;
        return followersCount;
    }

    async getUser(userId: number): Promise<User> {
        return await this.usersService.findOne(userId);
    }


}
