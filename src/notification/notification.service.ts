import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ItemNumber } from "src/common/global-models/general.model";
import { SocketGateway } from "src/socket-gateway/socket.gateway";
import { UserService } from "src/user/user.service";
import { NotificationDocument, NotificationDto, Notification } from "./notification.model";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel("Notification") private notificationModel: Model<NotificationDocument>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject(forwardRef(() => SocketGateway)) private readonly socketGateway: SocketGateway,
  ) {}

  async create(notificationDto: NotificationDto): Promise<Notification> {
    let createdNotification = await this.notificationModel.create(notificationDto);
    return createdNotification;
  }

  async findAll(user): Promise<Notification[]> {
    let notifications = await this.notificationModel
      .find({ user: new Types.ObjectId(user._id) })
      .sort({ createdAt: -1 })
      .exec();
    this.makeNotificationsSeen(user._id, notifications);
    return notifications;
  }

  async makeNotificationsSeen(userId: string, nofiications: Notification[]) {
    let allNotificationsAreOpen = true;
    for (let notif of nofiications) {
      if (notif.isNew === true) {
        let notifFromDb = await this.notificationModel.findById(notif._id);
        notifFromDb.isNew = false;
        await notifFromDb.save();
        allNotificationsAreOpen = false;
      }
    }
    console.log("allNotificationsAreOpen", allNotificationsAreOpen);
    if (!allNotificationsAreOpen) {
      this.socketGateway.emitNotificationsSeen(userId);
    }
  }
  async getNumberOfNewNotifications(userId: string): Promise<ItemNumber> {
    let notificationsLength = await this.notificationModel.find({ user: new Types.ObjectId(userId), isNew: true }).countDocuments();
    let itemNumber: ItemNumber = {
      number: notificationsLength,
    };
    return itemNumber;
  }
}
