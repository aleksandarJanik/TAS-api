import { forwardRef, Module } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { ExamController } from "./exam.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Exam, ExamSchema } from "./exam.model";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]), forwardRef(() => UserModule)],
  providers: [ExamService],
  controllers: [ExamController],
  exports: [ExamService],
})
export class ExamModule {}
