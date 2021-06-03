import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt } from 'class-validator';

@InputType()
export class CreateTweetInput {
    @Field()
    content: string;

    @IsInt()
    @Field(type => Int)
    userTweetId: number
}

