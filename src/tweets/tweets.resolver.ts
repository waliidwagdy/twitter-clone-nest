import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { CreateTweetInput } from './dto/create-tweet.input';
import { Pagination } from '../paginationDTO/pagination.input';
import { Tweet } from './tweet.entity';
import { TweetsService } from './tweets.service';

@Resolver(of => Tweet)
export class TweetsResolver {
    constructor(private tweetService: TweetsService) { }

    @Query(returns => [Tweet])
    getTweets(@Args('pagination') pagination: Pagination): Promise<Tweet[]> {
        return this.tweetService.findAll(pagination);
    }

    @Query(returns => Int)
    getTweetsCount(@Args('userId', { type: () => Int }) userId: number) {
        return this.tweetService.getTweetsCount(userId);
    }

    @Query(returns => Tweet)
    getTweet(@Args('id', { type: () => Int }) id: number): Promise<Tweet> {
        return this.tweetService.findOne(id);
    }

    @ResolveField(returns => User)
    user(@Parent() tweet: Tweet): Promise<User> {
        return this.tweetService.getUser(tweet.userTweetId);
    }

    @Mutation(returns => Tweet)
    createTweet(@Args('createTweetInput') createTweetInput: CreateTweetInput): Promise<Tweet> {
        return this.tweetService.createTweet(createTweetInput);
    }
}
