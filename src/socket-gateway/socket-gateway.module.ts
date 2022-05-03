import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { SocketGateway } from "./socket.gateway";

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketGatewayModule {}
