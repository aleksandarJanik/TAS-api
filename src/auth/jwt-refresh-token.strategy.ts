import { UserRole } from "src/user-role/user-role.model";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException, Body } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { UserAuthDto } from "src/user/user.model";
import { jwtConstants } from "./constants";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refreshtoken") {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    let refreshToken = await this.userService.findRefreshTokenByTokenAndUserId(req.body.refreshToken, payload._id);
    let user = await this.userService.findByUsername(payload.username);

    //TODO: Maybe check if user is banned here
    if (!refreshToken || !user) {
      throw new UnauthorizedException();
    }
    // let userRole = user.userRole as UserRole;
    // const userPayload: UserAuthDto = { username: user.username, _id: user._id + "", role: userRole.name };
    // return { userId: payload.sub, username: payload.username };
    return user;
  }
}
