import { Injectable, NestMiddleware } from "@nestjs/common";
import { isArray } from "class-validator";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { UsersService } from "../../users.service";
import { UserEntity } from "../../entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService){}
    async use(req: Request, res: Response, next: NextFunction) {
        // const { user } = req.body;
        // req.currentUser = user;
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if(!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer')){
            req.currentUser = undefined;
            next();
        }else{
            try {
                const token = authHeader.split(' ')[1];
                if (!token) {
                    req.currentUser = undefined;
                    return next();
                }
                // console.log(token);
                const {id} = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayload;
                const currentUser = await this.usersService.findOne(id);
                req.currentUser = currentUser;
                console.log(currentUser);
                next();
            } catch (error) {
                // Token is invalid or expired
                req.currentUser = undefined;
                next();
            }
        }
    }
}
interface JwtPayload {
    id: number;
    //email: string;
}