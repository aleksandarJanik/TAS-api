import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClassModule } from "src/classs/class.module";
import { ExamModule } from "src/exam/exam.module";
import { StudentModule } from "src/student/student.module";
import { UserModule } from "src/user/user.module";
import { StudentSpecialTokenController } from "./student-special-token.controller";
import { StudentSpecialToken, StudentSpecialTokenSchema } from "./student-special-token.model";
import { StudentSpecialTokenService } from "./student-special-token.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentSpecialToken.name, schema: StudentSpecialTokenSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => ClassModule),
    forwardRef(() => ExamModule),
    forwardRef(() => StudentModule),
  ],
  controllers: [StudentSpecialTokenController],
  providers: [StudentSpecialTokenService],
  exports: [StudentSpecialTokenService],
})
export class StudentSpecialTokenModule {}
