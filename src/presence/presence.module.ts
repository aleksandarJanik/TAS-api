import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClassModule } from "src/classs/class.module";
import { UserModule } from "src/user/user.module";
import { PresenceController } from "./presence.controller";
import { Presence, PresenceSchema } from "./presence.model";
import { PresenceService } from "./presence.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Presence.name, schema: PresenceSchema }]), forwardRef(() => UserModule), forwardRef(() => ClassModule)],
  controllers: [PresenceController],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
