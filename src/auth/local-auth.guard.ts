import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    console.log("errorGuard", err);
    if (err || !user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: "Incorrect username or password!",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
