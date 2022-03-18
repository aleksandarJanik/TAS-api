import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { ResultController } from "./result.controller";
import { Result, ResultSchema } from "./result.model";
import { ResultService } from "./result.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]), forwardRef(() => UserModule)],
  controllers: [ResultController],
  providers: [ResultService],
  exports: [ResultService],
})
export class ResultModule {}
