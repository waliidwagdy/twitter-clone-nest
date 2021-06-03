import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt } from 'class-validator';

@InputType()
export class Pagination {
    @IsInt()
    @Field(type => Int)
    page: number;

    @IsInt()
    @Field(type => Int)
    perPage: number
}

