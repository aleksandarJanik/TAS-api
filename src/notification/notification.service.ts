import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserService } from "src/user/user.service";
import { NotificationDocument, NotificationDto, Notification } from "./notification.model";

@Injectable()
export class NotificationService {
  constructor(@InjectModel("Notification") private notificationModel: Model<NotificationDocument>, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  async create(notificationDto: NotificationDto): Promise<Notification> {
    let createdNotification = await this.notificationModel.create(notificationDto);
    return createdNotification;
  }

  async findAll(user): Promise<Notification[]> {
    let notifications = await this.notificationModel
      .find({ user: new Types.ObjectId(user._id) })
      .sort({ createdAt: -1 })
      .exec();
    return notifications;
  }
}
