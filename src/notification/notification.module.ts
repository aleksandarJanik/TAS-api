import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SocketGatewayModule } from "src/socket-gateway/socket-gateway.module";
import { UserModule } from "src/user/user.module";
import { NotificationController } from "./notification.controller";
import { NotificationSchema } from "./notification.model";
import { NotificationService } from "./notification.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Notification", schema: NotificationSchema }]), forwardRef(() => UserModule), forwardRef(() => SocketGatewayModule)],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
