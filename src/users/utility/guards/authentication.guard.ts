import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const currentUser = request.currentUser;
        
        if (!currentUser) {
            throw new UnauthorizedException('You must be authenticated to access this resource');
        }
        
        return true;
    }
}