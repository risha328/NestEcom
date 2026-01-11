import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../common/user-roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class UpdateUserGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const currentUser = request.currentUser;
        const userId = parseInt(request.params.id, 10);

        // User must be authenticated
        if (!currentUser) {
            throw new ForbiddenException('You must be authenticated to access this resource');
        }

        // Debug logging
        console.log('UpdateUserGuard - Current User ID:', currentUser.id, 'Type:', typeof currentUser.id);
        console.log('UpdateUserGuard - Requested User ID:', userId, 'Type:', typeof userId);
        console.log('UpdateUserGuard - User Roles:', currentUser.roles);
        console.log('UpdateUserGuard - ID Match:', currentUser.id === userId, 'Loose Match:', currentUser.id == userId);

        // Allow if user is updating their own profile (handle both string and number types)
        if (currentUser.id === userId || currentUser.id == userId || Number(currentUser.id) === userId) {
            console.log('UpdateUserGuard - Allowing self-update');
            return true;
        }

        console.log('UpdateUserGuard - Not self-update, checking admin role...');

        // Otherwise, check if user has admin role
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            // If no roles specified, only allow self-update (already checked above)
            throw new ForbiddenException('You can only update your own profile');
        }

        // Check if user has at least one of the required roles
        const userRoles = Array.isArray(currentUser.roles) 
            ? currentUser.roles 
            : currentUser.roles 
                ? [currentUser.roles] 
                : [];
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
            console.log('UpdateUserGuard - User does not have required role. User roles:', userRoles, 'Required:', requiredRoles);
            throw new ForbiddenException(
                `You do not have permission to access this resource. Required roles: ${requiredRoles.join(', ')}. Your current role: ${currentUser.roles || 'none'}`
            );
        }

        return true;
    }
}

