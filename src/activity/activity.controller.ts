import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Activity, ActivityDto } from "./activity.model";
import { ActivityService } from "./activity.service";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";

@ApiTags("Activity")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOperation({ summary: "Create new activity" })
  @ApiCreatedResponse({ description: "The Activity has been successfully created", type: Activity })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: ActivityDto })
  @Roles("Teacher")
  @Post("/create")
  async create(@Body() activityDto: ActivityDto, @Req() req): Promise<Activity> {
    return await this.activityService.create(activityDto, req.user);
  }

  @ApiOperation({ summary: "Find all activities by user" })
  @ApiOkResponse({ description: "The Activity list has been successfully returned", type: [Activity] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get(":classId")
  async findAll(@Req() req, @Param("classId") classId: string): Promise<Activity[]> {
    return await this.activityService.findAll(classId, req.user);
  }

  @ApiOperation({ summary: "Remove Activity by id" })
  @ApiOkResponse({ description: "The Activity has been successfully removed", type: Activity })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Delete(":activityId/class/:classId/student/:studentId")
  async remove(@Param("activityId") activityId: string, @Param("classId") classId: string, @Param("studentId") studentId: string, @Req() req) {
    return await this.activityService.remove(classId, activityId, studentId, req.user);
  }

  @ApiOperation({ summary: "Update Activity by id" })
  @ApiOkResponse({ description: "The Activity has been successfully updated", type: Activity })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: ActivityDto })
  @Roles("Teacher")
  @Put(":activityId")
  async update(@Body() activityDto: ActivityDto, @Param("activityId") activityId: string, @Req() req): Promise<Activity> {
    return await this.activityService.update(activityDto, activityId, req.user);
  }
}
