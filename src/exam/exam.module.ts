import { forwardRef, Module } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { ExamController } from "./exam.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Exam, ExamSchema } from "./exam.model";
import { UserModule } from "src/user/user.module";
import { StudentSpecialTokenModule } from "src/student-special-token/student-special-token.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]), forwardRef(() => UserModule), forwardRef(() => StudentSpecialTokenModule)],
  providers: [ExamService],
  controllers: [ExamController],
  exports: [ExamService],
})
export class ExamModule {}
