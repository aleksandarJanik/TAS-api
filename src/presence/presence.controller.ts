import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { RolesGuard } from "src/common/guards/roles.guard";
import { PresenceService } from "./presence.service";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Presence, PresenceDto } from "./presence.model";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { Roles } from "src/common/decorators/roles.decorator";

@ApiTags("Presence")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("presence")
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}
  @ApiOperation({ summary: "Create new presence" })
  @ApiCreatedResponse({ description: "The presence has been successfully created", type: Presence })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: PresenceDto })
  @Roles("Teacher")
  @Post("/create")
  async create(@Body() presenceDto: PresenceDto, @Req() req): Promise<Presence> {
    return await this.presenceService.create(presenceDto, req.user);
  }

  @ApiOperation({ summary: "Find all presences by user" })
  @ApiOkResponse({ description: "The Presence list has been successfully returned", type: [Presence] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get(":studentId")
  async findAll(@Req() req, @Param("studentId") studentId: string): Promise<Presence[]> {
    return await this.presenceService.findAll(studentId, req.user);
  }

  @ApiOperation({ summary: "Remove Presence by id" })
  @ApiOkResponse({ description: "The Presence has been successfully removed", type: Presence })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Delete(":presenceId/class/:classId/student/:studentId")
  async remove(@Param("presenceId") presenceId: string, @Param("classId") classId: string, @Param("studentId") studentId: string, @Req() req) {
    return await this.presenceService.remove(classId, presenceId, studentId, req.user);
  }

  @ApiOperation({ summary: "Update Presence by id" })
  @ApiOkResponse({ description: "The Presence has been successfully updated", type: Presence })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: PresenceDto })
  @Roles("Teacher")
  @Put(":presenceId")
  async update(@Body() presenceDto: PresenceDto, @Param("presenceId") presenceId: string, @Req() req): Promise<Presence> {
    return await this.presenceService.update(presenceDto, presenceId, req.user);
  }
}
