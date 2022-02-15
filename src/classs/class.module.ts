import { forwardRef, Module } from "@nestjs/common";
import { ClassService } from "./class.service";
import { ClassController } from "./class.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Class, ClassSchema } from "./class.model";
import { UserModule } from "src/user/user.module";
import { StudentModule } from "src/student/student.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]), forwardRef(() => UserModule), forwardRef(() => StudentModule)],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
