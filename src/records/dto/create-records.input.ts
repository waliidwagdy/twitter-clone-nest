import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt } from "class-validator";

@InputType()
export class CreateRecordInput {
    @IsInt()
    @Field(type => Int)
    followerId: number;

    @IsInt()
    @Field(type => Int)
    followedId: number;

}
