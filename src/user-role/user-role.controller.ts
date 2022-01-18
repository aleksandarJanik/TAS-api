import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserRoleDto, UserRole } from "./user-role.model";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserRoleService } from "./user-role.service";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { DeleteResult } from "src/common/helper-models/delete-result.model";

@ApiTags("User-role")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("user-role")
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @ApiOperation({ summary: "Creates new User-role" })
  @ApiCreatedResponse({ description: "The user-role has been successfully created", type: UserRole })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: CreateUserRoleDto })
  @Roles("Admin")
  @Post()
  create(@Body() userRole: CreateUserRoleDto) {
    return this.userRoleService.create(userRole);
  }

  @ApiOperation({ summary: "Find all User-roles" })
  @ApiOkResponse({ description: "The user-role list has been successfully returned!", type: UserRole })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Admin")
  @Get()
  async getSwag(): Promise<UserRole[]> {
    return await this.userRoleService.findAll();
  }

  @ApiOperation({ summary: "Update User-role by id" })
  @ApiOkResponse({ description: "The user-role has been successfully updated", type: UserRole })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: CreateUserRoleDto })
  @Roles("Admin")
  @Put(":id")
  async update(@Param("id") id: string, @Body() users: CreateUserRoleDto) {
    let result = await this.userRoleService.update(id, users);
    return result;
  }

  @ApiOperation({ summary: "Remove User-role by id" })
  @ApiOkResponse({ description: "The user-role has been successfully removed", type: DeleteResult })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Admin")
  @Delete(":id")
  remove(@Param("id") id: string) {
    const result = this.userRoleService.remove(id);
  }
}
