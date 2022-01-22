import { forwardRef, Module } from "@nestjs/common";
import { ClassService } from "./class.service";
import { ClassController } from "./class.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Class, ClassSchema } from "./class.model";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]), forwardRef(() => UserModule)],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
