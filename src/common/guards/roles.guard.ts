import { ExecutionContext, Injectable, CanActivate, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/user-role/user-role.model";
import { UserAuthDto } from "src/user/user.model";
import { UserService } from "src/user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();
    // console.log("roles:", roles);
    let user = request.user as UserAuthDto;
    // let currentUserRole: UserRole = userFromDb.userRole as UserRole;
    // console.log(request.user);
    if (!roles) {
      return true;
    }
    let rolesLowerCase = roles.map((role) => role.toLowerCase());
    // console.log('user role:', request.user.userRole);
    return this.matchRoles(rolesLowerCase, user.role);
  }

  matchRoles(roles: string[], role: string): boolean {
    if (!role) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "You do not have the privileges to do that!",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (roles.includes("owner")) return true;

    let isMatch = roles.includes(role.toLowerCase());
    if (!isMatch) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "You do not have the privileges to do that!",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return isMatch;
  }
}
