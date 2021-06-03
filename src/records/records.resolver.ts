import { Args, Mutation, Parent, Query, ResolveField, Resolver, Int } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { CreateRecordInput } from './dto/create-records.input';
import { Record } from './record.entity';
import { RecordsService } from './records.service';
import { Pagination } from '../paginationDTO/pagination.input';
import { GetFollowers } from './dto/getfollwers.inputs';


@Resolver(of => Record)
export class RecordsResolver {
    constructor(private recordService: RecordsService) { }

    @Query(returns => [Record])
    getRecords(@Args('pagination') pagination: Pagination): Promise<Record[]> {
        return this.recordService.findAll(pagination);
    }

    @Query(returns => [User])
    getFollowers(@Args('getFollowers') getFollowers: GetFollowers): Promise<User[]> {
        return this.recordService.getFollowers(getFollowers);
    }

    @Query(returns => [User])
    getFollowings(@Args('getFollowers') getFollowers: GetFollowers): Promise<User[]> {
        return this.recordService.getFollowings(getFollowers);
    }
    @Query(returns => Int)
    getFollowersCount(@Args('userId', { type: () => Int }) userId: number) {
        return this.recordService.getFollowersCount(userId);
    }

    @Mutation(returns => Record)
    createRecord(@Args('createRecordInput') createRecordInput: CreateRecordInput): Promise<Record> {
        return this.recordService.addRecord(createRecordInput);
    }
    @ResolveField(returns => User)
    user(@Parent() record: Record): Promise<User> {
        return this.recordService.getUser(record.followerId);
    }

}


