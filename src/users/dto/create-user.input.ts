import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, Length } from 'class-validator';


@InputType()
export class CreateUserInput {
    @Length(5, 20)
    @Field()
    username: string

    @IsEmail()
    @Field()
    email: string

    @Length(8, 25)
    @Field()
    password: string
}

