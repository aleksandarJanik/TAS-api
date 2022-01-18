import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // console.log("LocalStrategy validate");
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return null;
    }
    return user;
  }
}
