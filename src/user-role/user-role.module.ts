import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { UserRoleController } from "./user-role.controller";
import { UserRole, UserRoleSchema } from "./user-role.model";
import { UserRoleService } from "./user-role.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: UserRole.name, schema: UserRoleSchema }]), forwardRef(() => UserModule)],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
