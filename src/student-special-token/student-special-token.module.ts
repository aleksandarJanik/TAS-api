import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ActivityModule } from "src/activity/activity.module";
import { ClassModule } from "src/classs/class.module";
import { ExamModule } from "src/exam/exam.module";
import { NotificationModule } from "src/notification/notification.module";
import { ResultModule } from "src/result/result.module";
import { SocketGatewayModule } from "src/socket-gateway/socket-gateway.module";
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
    forwardRef(() => ResultModule),
    forwardRef(() => ActivityModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => SocketGatewayModule),
  ],
  controllers: [StudentSpecialTokenController],
  providers: [StudentSpecialTokenService],
  exports: [StudentSpecialTokenService],
})
export class StudentSpecialTokenModule {}
