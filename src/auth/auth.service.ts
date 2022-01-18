import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { ChangePassowrdWithToken, User, UserAuthDto } from "src/user/user.model";
import { CreateToken, Token, TokenDocument, TokenType } from "./token.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ACTIVATE_USER_TOKEN_EXPIRATION_DAYS, RESET_PASSWORD_TOKEN_EXPIRATION_DAYS } from "./constants";
import { ResponseSuccess } from "src/common/global-models/success.model";
const randtoken = require("rand-token");

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, @InjectModel("Token") private tokenModel: Model<TokenDocument>, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // console.log("AuthService validateUser");
    const user = await this.userService.findByUsername(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // console.log("AuthService login", user);
    // const payload = { username: user.username, sub: user._id };
    const payload: UserAuthDto = { username: user.username, _id: user._id, role: user.userRole.name };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(user._id),
    };
  }

  async refreshToken(user: any) {
    const payload: UserAuthDto = { username: user.username, _id: user._id, role: user.userRole.name };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generateRefreshToken(userId): Promise<string> {
    let refreshToken = randtoken.generate(20);
    var expirydate = new Date();
    // expirydate.setDate(expirydate.getDate() + 6);
    await this.userService.createRefreshToken(refreshToken, userId);
    return refreshToken;
  }

  async userActivation(token: string) {
    let tokenFromDb = await this.validateToken(token, TokenType.ACTIVATE);
    if (tokenFromDb) {
      try {
        await this.userService.activateUser(tokenFromDb.user as Types.ObjectId);
      } catch (e) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: "Not activated, something bad happened!",
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.tokenModel.deleteOne({ _id: tokenFromDb._id }).lean();
    }
  }

  async requestResetPassowrdToken(usernameOrEmail: string): Promise<Token> {
    let user = await this.userService.findUserByEmail(usernameOrEmail);
    if (!user) {
      user = await this.userService.findUserByUsername(usernameOrEmail);
    }
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Your username or email doesn't exist!",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let date = new Date();
    let tokenFromDb = await this.tokenModel.findOne({ tokenType: TokenType.RESET_PASSWORD, user: user._id });
    if (tokenFromDb) {
      //send mail again
    }

    date.setDate(date.getDate() + RESET_PASSWORD_TOKEN_EXPIRATION_DAYS);

    let tokenCreated = await this.generateToken(user._id, TokenType.RESET_PASSWORD, date);
    // let link = `http://localhost:3001/reset-password/${tokenCreated.token}`;
    // return await this.emailService.sendEmail(user, "Password reset", link);

    return tokenCreated;
  }

  async generateToken(userId: Types.ObjectId, typeToken: TokenType, expireAt: Date): Promise<Token> {
    let newTokenDto: CreateToken = {
      token: randtoken.generate(20),
      user: userId,
      tokenType: typeToken,
      expireAt: expireAt,
    };
    let token = await this.tokenModel.create(newTokenDto);
    return token;
  }

  async resetPasswordWithToken(changePasswordToken: ChangePassowrdWithToken): Promise<Token> {
    let tokenFromDb = await this.validateToken(changePasswordToken.token, TokenType.RESET_PASSWORD);
    if (tokenFromDb) {
      await this.userService.resetPassword(tokenFromDb.user as Types.ObjectId, changePasswordToken.newPassword);
      return await this.tokenModel.deleteOne({ _id: tokenFromDb._id }).lean();
    }
  }

  async validateToken(token: string, tokenType: TokenType) {
    let tokenFromDb = await this.tokenModel.findOne({ token: token }).exec();
    if (!tokenFromDb || tokenFromDb.tokenType !== tokenType) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Invalid or expired token!",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return tokenFromDb;
  }

  async generateAndSendActivationToken(username: string): Promise<Token> {
    let user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Your username doesn't exist!",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let date = new Date();
    let tokenFromDb = await this.tokenModel.findOne({ tokenType: TokenType.ACTIVATE, user: user._id });
    if (tokenFromDb) {
      //send mail again
      console.log("send mail");
    }

    date.setDate(date.getDate() + ACTIVATE_USER_TOKEN_EXPIRATION_DAYS);

    let tokenCreated = await this.generateToken(user._id, TokenType.ACTIVATE, date);
    // let link = `http://localhost:3001/reset-password/${tokenCreated.token}`;
    // return await this.emailService.sendEmail(user, "Password reset", link);
    return tokenCreated;
  }
}
