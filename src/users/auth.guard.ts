import { ExecutionContext } from "@nestjs/common";
import { CanActivate, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context).getContext();
        // console.log(ctx.header);

        if (!ctx.header.authorization) {
            return false;
        }
        ctx.user = await this.validateToken(ctx.header.authorization);
        return true;
    }

    async validateToken(auth: string) {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        const token = auth.split(' ')[1];
        try {
            return jwt.verify(token, 'supersecret');
        } catch {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }
}