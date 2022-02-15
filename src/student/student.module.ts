import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClassModule } from "src/classs/class.module";
import { UserModule } from "src/user/user.module";
import { StudentController } from "./student.controller";
import { Student, StudentSchema } from "./student.model";
import { StudentService } from "./student.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]), forwardRef(() => UserModule), forwardRef(() => ClassModule)],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
