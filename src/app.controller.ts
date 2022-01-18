import { Body, Controller, Get, Post, Request, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBody, ApiForbiddenResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { Public } from "./auth/constants";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { ResetPasswordDto, TokenType } from "./auth/token.model";
import { HttpExceptionAnotated } from "./common/global-models/exception";
import { ResponseSuccess } from "./common/global-models/success.model";
import { RefreshTokenDto } from "./user/refresh-token.model";
import { TokenWithRefresh, LoginUser, Token, User, RegisterCustomerDto, ChangePassowrdWithToken, TokenDto } from "./user/user.model";
import { UserService } from "./user/user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class AppController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Public()
  @ApiOperation({ summary: "Login" })
  @ApiCreatedResponse({ description: "The User has been successfully login", type: TokenWithRefresh })
  @ApiUnauthorizedResponse({ description: "Incorrect username or password!", type: HttpExceptionAnotated })
  @ApiBody({ type: LoginUser })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req): Promise<Token> {
    let response = await this.authService.login(req.user);
    return response;
  }

  @ApiOperation({ summary: "Register new Customer" })
  @ApiCreatedResponse({ description: "The Customer has been successfully registered", type: User })
  @ApiForbiddenResponse({ description: "Incorrect register data", type: HttpExceptionAnotated })
  @ApiBody({ type: RegisterCustomerDto })
  @Public()
  @Post("register")
  async teacherRegister(@Body() userDto: RegisterCustomerDto): Promise<User> {
    return await this.userService.teacherRegister(userDto);
  }

  @ApiOperation({ summary: "Generate new JWT with Refresh Token" })
  @ApiCreatedResponse({ description: "New JWT has been successfully generated", type: Token })
  @ApiUnauthorizedResponse({ description: "Refresh Token invalid or expired", type: HttpExceptionAnotated })
  @ApiBody({ type: RefreshTokenDto })
  @ApiBearerAuth("jwt")
  @Public()
  @UseGuards(AuthGuard("jwt-refreshtoken"))
  @Post("/refreshtoken")
  async refreshToken(@Request() req, @Body() RefreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(req.user);
  }

  @ApiOperation({ summary: "Generate new JWT with Refresh Token" })
  @ApiCreatedResponse({ description: "New JWT has been successfully generated", type: Token })
  @ApiUnauthorizedResponse({ description: "Refresh Token invalid or expired", type: HttpExceptionAnotated })
  @Post("/check-login")
  async checkLogin(@Req() req) {
    return await this.userService.findById(req.user._id);
  }

  @ApiOperation({ summary: "Remove Refresh Token" })
  @ApiCreatedResponse({ description: "Refresh Token has been successfully removed", type: Token })
  @ApiUnauthorizedResponse({ description: "Refresh Token invalid or expired", type: HttpExceptionAnotated })
  @ApiBody({ type: RefreshTokenDto })
  @ApiBearerAuth("jwt")
  @Public()
  @Post("/logout")
  async logout(@Request() req, @Body() refreshTokenDto: RefreshTokenDto) {
    return await this.userService.removeRefreshToken(refreshTokenDto);
  }

  @ApiOperation({ summary: "Generate new token for RESET PASSWORD" })
  @ApiCreatedResponse({ description: "New token for RESET PASSWORD has been successfully generated", type: Token })
  @ApiUnauthorizedResponse({ description: "Refresh Token invalid or expired", type: HttpExceptionAnotated })
  @ApiBody({ type: ResetPasswordDto })
  @Public()
  @Post("/forgot-password")
  async resetPasswordToken(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.requestResetPassowrdToken(resetPasswordDto.usernameOrEmail);
    let success: ResponseSuccess = { message: "Check your email to change your password!", success: true };
    return success;
  }

  @ApiOperation({ summary: "Check for token validation and change password" })
  @ApiCreatedResponse({ description: "The token is valid and the password is changed", type: String })
  @ApiUnauthorizedResponse({ description: "The Token is invalid or expired", type: HttpExceptionAnotated })
  @ApiBody({ type: ChangePassowrdWithToken })
  @Public()
  @Post("/reset-password")
  async changePassword(@Body() changePasswordToken: ChangePassowrdWithToken) {
    await this.authService.resetPasswordWithToken(changePasswordToken);
    let success: ResponseSuccess = { message: "Password changed successfully!", success: true };
    return success;
  }

  @ApiOperation({ summary: "Check for token validation" })
  @ApiCreatedResponse({ description: "The token is valid", type: String })
  @ApiUnauthorizedResponse({ description: "The Token is invalid or expired", type: HttpExceptionAnotated })
  @ApiBody({ type: TokenDto })
  @Public()
  @Post("/validate-token")
  async checkTokenValidation(@Body() token: TokenDto) {
    let tokenFromDb = await this.authService.validateToken(token.token, TokenType.RESET_PASSWORD);
    if (tokenFromDb) {
      let success: ResponseSuccess = { message: "Token is valid!", success: true };
      return success;
    }
  }
}
