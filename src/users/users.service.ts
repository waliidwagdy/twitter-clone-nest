import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from '../paginationDTO/pagination.input';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';
import { LoginUserInput } from './dto/login-user.input';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 12;




@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async createUser(createUserInput: CreateUserInput): Promise<User> {
        //check if there are any old users having the same username or email
        const isOldUsername = await this.userRepository.findOne({ where: { username: createUserInput.username } });
        const isOldEmail = await this.userRepository.findOne({ where: { email: createUserInput.email } });
        if (isOldUsername) {
            throw new HttpException('Taken username', HttpStatus.FORBIDDEN);
        }
        if (isOldEmail) {
            throw new HttpException('Taken email', HttpStatus.FORBIDDEN);
        }
        const hashedPassword = await bcrypt.hash(createUserInput.password, saltOrRounds);
        const user = { ...createUserInput, password: hashedPassword };
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }
    async findAll(pagination: Pagination): Promise<User[]> {
        //pagination logic
        if (!pagination.page) {//if there is no page sent then we are in page by default
            pagination.page = 1;
        }
        return await this.userRepository.find({
            order: {
                id: 'ASC'
            },
            skip: (pagination.page - 1) * pagination.perPage,
            take: pagination.perPage
        });
    }
    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOneOrFail(id);
    }

    async findByIds(ids: number[]): Promise<User[]> {
        return await this.userRepository.findByIds(ids);
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneOrFail({ where: { email: email } });
    }
    async login(loginUserInput: LoginUserInput): Promise<string> {
        const user = await this.findByEmail(loginUserInput.email);
        const isMatch = await bcrypt.compare(loginUserInput.password, user.password);
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
        } else if (!isMatch) {
            throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);

        }
        return this.createToken(user);
    }

    createToken({ email, id }: User) {
        return jwt.sign({ email, id }, 'supersecret');
    }
}
