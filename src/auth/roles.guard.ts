import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./auth-roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {


        try {
            const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])
            if (!requiredRoles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(" ")[0];
            const token = authHeader.split(" ")[1];
            if (bearer !== "Bearer" || !token) throw new UnauthorizedException("Incorrect User")

            const user = this.jwtService.verify(token);
            req.user = user;
            return user.roles.some(role => requiredRoles.includes(role.value))
        } catch (err) {
            console.log(err.message)
            throw new UnauthorizedException(err.message)
        }
    }
}