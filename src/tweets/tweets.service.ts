import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateTweetInput } from './dto/create-tweet.input';
import { Tweet } from './tweet.entity';
import { User } from '../users/user.entity';
import { Pagination } from '../paginationDTO/pagination.input';

@Injectable()
export class TweetsService {
    constructor(@InjectRepository(Tweet) private TweetRepository: Repository<Tweet>, private usersService: UsersService) { }

    async createTweet(createTweetInput: CreateTweetInput): Promise<Tweet> {
        const newTweet = this.TweetRepository.create(createTweetInput);
        return await this.TweetRepository.save(newTweet);
    }

    async findAll(pagination: Pagination): Promise<Tweet[]> {
        //pagination logic
        if (!pagination.page) {
            pagination.page = 1;
        }
        return await this.TweetRepository.find({
            order: {
                id: 'ASC'
            },
            skip: (pagination.page - 1) * pagination.perPage,
            take: pagination.perPage
        });
    }

    async getTweetsCount(userId: number): Promise<number> {
        const tweets = await this.TweetRepository.find({ where: { userTweetId: userId } });
        const tweetsCount = [...tweets].map(ele => {
            return ele.id;
        }).length;
        return tweetsCount;
    }

    async findOne(id: number): Promise<Tweet> {
        return await this.TweetRepository.findOneOrFail(id);
    }
    async getUser(userTweetId: number): Promise<User> {
        return await this.usersService.findOne(userTweetId);
    }

}
