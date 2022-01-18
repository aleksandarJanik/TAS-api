import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtRefreshTokenStrategy } from "./jwt-refresh-token.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "./token.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Token", schema: TokenSchema }]),
    forwardRef(() => UserModule),
    PassportModule,

    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
