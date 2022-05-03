import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { NotificationService } from "./notification.service";
import { NotificationDocument, NotificationDto, Notification } from "./notification.model";

@ApiTags("Notification")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: "Find all Notifications by user" })
  @ApiOkResponse({ description: "The Notification list has been successfully returned", type: [Notification] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get()
  async findAll(@Req() req): Promise<Notification[]> {
    return await this.notificationService.findAll(req.user);
  }
}
