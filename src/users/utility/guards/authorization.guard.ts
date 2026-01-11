import { 
    CanActivate, 
    ExecutionContext, 
    ForbiddenException, 
    Type, 
    mixin,
    Injectable 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../common/user-roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Mixin function that creates an Authorization Guard
 * This allows for flexible composition and reuse of authorization logic
 * 
 * The mixin pattern enables:
 * - Creating reusable guard logic
 * - Easy composition with other guards
 * - Type-safe guard classes
 * 
 * @returns A guard class that checks if the user has the required roles
 * 
 * @example
 * // Create a custom authorization guard
 * const CustomAuthGuard = RoleAuthorizationMixin();
 * 
 * // Use it in a controller
 * @UseGuards(AuthenticationGuard, CustomAuthGuard)
 * @RolesDecorator(Roles.ADMIN)
 */
export const RoleAuthorizationMixin = (): Type<CanActivate> => {
    @Injectable()
    class RoleAuthorizationGuard implements CanActivate {
        constructor(protected readonly reflector: Reflector) {}

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

    return mixin(RoleAuthorizationGuard);
};

/**
 * Default Authorization Guard instance
 * Use this for standard role-based authorization
 * 
 * @example
 * // In a controller:
 * @UseGuards(AuthenticationGuard, AuthorizationGuard)
 * @RolesDecorator(Roles.ADMIN)
 * @Get('admin-only')
 * adminOnly() {
 *   return 'This is admin only';
 * }
 */
@Injectable()
export class AuthorizationGuard extends RoleAuthorizationMixin() {
    constructor(reflector: Reflector) {
        super(reflector);
    }
}
