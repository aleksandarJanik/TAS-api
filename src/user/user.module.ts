import { RefreshToken, RefreshTokenSchema } from "./refresh-token.model";
import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, User, UserSchema } from "./user.model";
import { UserRoleModule } from "src/user-role/user-role.module";
import { UserExistsRule } from "src/common/custom-validators/userExist.validator";
import { EmailExistsRule } from "src/common/custom-validators/emailExist.validator";
import { TokenSchema } from "src/auth/token.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),

    forwardRef(() => UserRoleModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, UserExistsRule, EmailExistsRule],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
