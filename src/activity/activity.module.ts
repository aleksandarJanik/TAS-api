import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClassModule } from "src/classs/class.module";
import { UserModule } from "src/user/user.module";
import { ActivityController } from "./activity.controller";
import { Activity, ActivitySchema } from "./activity.model";
import { ActivityService } from "./activity.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }]), forwardRef(() => UserModule), forwardRef(() => ClassModule)],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
