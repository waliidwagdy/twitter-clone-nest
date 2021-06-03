import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "../users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@ObjectType()
export class Record {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Column()
    @Field(type => Int)
    followedId: number;

    @Column()
    @Field(type => Int)
    followerId: number;

    @ManyToOne(() => User, user => user.records)
    @Field(type => User)
    user: User;


}