import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, JoinTable, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Tweet } from "../tweets/tweet.entity";
import { OneToMany } from "typeorm";
import { Record } from "../records/record.entity";


@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number

    @Column({ unique: true })
    @Field()
    username: string

    @Column({ unique: true })
    @Field()
    email: string

    @Column()
    @Field()
    password: string

    @OneToMany(() => Tweet, tweet => tweet.user)
    @Field(type => [Tweet], { nullable: true })
    tweets?: Tweet[];

    @OneToMany(() => Record, record => record.user)
    @Field(type => [Record])
    records: Record[];

}