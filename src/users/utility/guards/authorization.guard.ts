import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../common/user-roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If no roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const currentUser = request.currentUser;

        // User must be authenticated (this should be handled by AuthenticationGuard first)
        if (!currentUser) {
            throw new ForbiddenException('You must be authenticated to access this resource');
        }

        // Check if user has at least one of the required roles
        // Handle both array and single role value
        const userRoles = Array.isArray(currentUser.roles) 
            ? currentUser.roles 
            : currentUser.roles 
                ? [currentUser.roles] 
                : [];
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
            console.log(`Authorization failed - User ID: ${currentUser.id}, User Roles: ${JSON.stringify(userRoles)}, Required Roles: ${requiredRoles.join(', ')}`);
            throw new ForbiddenException(
                `You do not have permission to access this resource. Required roles: ${requiredRoles.join(', ')}`
            );
        }

        return true;
    }
}

