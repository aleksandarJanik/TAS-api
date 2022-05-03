import { UserService } from "src/user/user.service";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { forwardRef, Inject } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(@Inject(forwardRef(() => AuthService)) private authService: AuthService, @Inject(forwardRef(() => UserService)) private userService: UserService) {}

  afterInit(server: Server) {
    console.log("socket server initialized");
  }

  handleConnection(socket: Socket, ...args: any[]) {
    console.log("client connected", socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log("client disconnect", socket.id);
  }

  @SubscribeMessage("login")
  async loginSocket(client: Socket, message: { refreshToken: string; userId: string }) {
    console.log("loginSocket");
    let refreshToken = await this.userService.findRefreshTokenByTokenAndUserId(message.refreshToken, message.userId);
    // let user = await this.userService.findById(refreshToken.user._id);
    client.join(refreshToken.user._id.toString());
    let user = await this.userService.findById(refreshToken.user._id + "");
    if (user.userRole.name === "Admin") {
      client.join("admin");
    }
    // user.userRole

    console.log(client.id, client.rooms);
    // this.emitMessageReceived(refreshToken.user._id.toString(), { test: "data" });
    // this.server.to(message.room).emit("chatToClient", message);
  }

  // @SubscribeMessage("logout")
  // async logoutSocket(client: Socket, message: { refreshToken: string; userId: string }) {
  //   let rooms = client.rooms;

  //   for (let room of rooms) {
  //     try {
  //       await client.leave(room);
  //     } catch (ex) {
  //       console.log("error leaving room");
  //     }
  //   }
  // }

  @SubscribeMessage("chatToServer")
  handleMessage(client: Socket, message: { sender: string; room: string; message: string }) {
    this.server.to(message.room).emit("chatToClient", message);
  }

  @SubscribeMessage("joinRoom")
  handleRoomJoin(client: Socket, room: string) {
    console.log("join room", room);
    client.join(room);
    client.emit("joinedRoom", room);
    console.log(client.id, client.rooms);
  }

  @SubscribeMessage("leaveRoom")
  handleRoomLeave(client: Socket, room: string) {
    client.leave(room);
    client.emit("leftRoom", room);
  }

  emitNotificationsSeen(room: string, data = {}) {
    // console.log(client.id, client.rooms);
    // client.emit("messageReceived", room);
    this.server.to(room).emit("notificationsSeen", data);
  }

  emitNotificationReceived(room: string, data = {}) {
    this.server.to(room).emit("notificationReceived", data);
  }
}
