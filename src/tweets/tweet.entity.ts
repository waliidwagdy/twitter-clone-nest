import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "../users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["id"])
@ObjectType()
export class Tweet {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number

    @Column()
    @Field()
    content: string

    @Column()
    @Field(type => Int)
    userTweetId: number;

    @ManyToOne(() => User, user => user.tweets)
    @Field(type => User)
    user: User;
}