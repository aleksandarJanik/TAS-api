import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { Public } from "src/auth/constants";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Token } from "src/auth/token.model";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { ResponseSuccess } from "src/common/global-models/success.model";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateUserRoleDto } from "src/user-role/user-role.model";
import { AcivateTokenDto, ChangeUserPWDto, CreateUserDto, Region, RegisterCustomerDto, SetAddressDto, TokenDto, UpdateCustomerDto, User, UserProfile } from "./user.model";
import { UserService } from "./user.service";

@ApiTags("User")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Create new User" })
  @ApiCreatedResponse({ description: "The User has been successfully created", type: User })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: CreateUserDto })
  @Roles("Admin")
  @Post("/create")
  async createUser(@Body() userDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(userDto);
  }

  @ApiOkResponse({ description: "The User has been successfully returned", type: User })
  @ApiUnauthorizedResponse({ description: "Unauthorized", type: HttpExceptionAnotated })
  @ApiBearerAuth("jwt")
  @Get("/profile")
  async getUser(@Req() req): Promise<UserProfile> {
    return await this.userService.findById(req.user._id);
  }

  @ApiOperation({ summary: "Find all Users" })
  @ApiOkResponse({ description: "The User list has been successfully returned", type: [User] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Admin")
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @ApiOperation({ summary: "Remove User by id" })
  @ApiOkResponse({ description: "The User has been successfully removed", type: User })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: CreateUserDto })
  @Roles("Admin")
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.userService.remove(id);
  }

  @ApiOperation({ summary: "Change user password by id" })
  @ApiOkResponse({ description: "The User password has been successfully changed", type: User })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: ChangeUserPWDto })
  @Post("change-password")
  async changeUserPassword(@Body() userDto: ChangeUserPWDto, @Req() req) {
    return await this.userService.changeUserPassword(userDto as ChangeUserPWDto, req.user._id);
  }

  @ApiOperation({ summary: "Activate user" })
  @ApiCreatedResponse({ description: "The user has been successfully activated", type: String })
  @ApiUnauthorizedResponse({ description: "The Token is invalid or expired", type: HttpExceptionAnotated })
  @Public()
  @Post("activate")
  async userActivation(@Body() token) {
    await this.authService.userActivation(token.token);
    let success: ResponseSuccess = { message: "User successfully activated", success: true };
    return success;
  }

  @ApiOperation({ summary: "Resend email for account activation" })
  @ApiCreatedResponse({ description: "The account has been successfully activated", type: String })
  // @ApiUnauthorizedResponse({ description: "The Token is invalid or expired", type: HttpExceptionAnotated })
  @Public()
  @Post("resend-activation")
  async resendEmailUserActivation(@Body() body) {
    let success: ResponseSuccess = { message: "The user has successfully completed the first step to verify his account!", success: true };
    await this.authService.generateAndSendActivationToken(body.username);
    return success;
  }
}
