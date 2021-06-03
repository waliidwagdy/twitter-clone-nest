import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Pagination } from '../paginationDTO/pagination.input';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Resolver(of => User)
export class UsersResolver {
    constructor(private usersService: UsersService) { }

    @Query(returns => User)
    @UseGuards(new AuthGuard())
    logged(@Context('user') user: User) {
        return user;
    }

    @Query(returns => [User])
    getUsers(@Args('pagination') pagination: Pagination): Promise<User[]> {
        return this.usersService.findAll(pagination);
    }

    @Query(returns => User)
    getUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Mutation(returns => User)
    createUser(@Args('createUserInupt') createUserInupt: CreateUserInput): Promise<User> {
        return this.usersService.createUser(createUserInupt);
    }

    @Mutation(returns => String)
    async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
        return this.usersService.login(loginUserInput);
    }
}
