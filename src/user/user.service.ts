import { RefreshToken, RefreshTokenDocument, RefreshTokenDto } from "./refresh-token.model";
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ChangePassowrdWithToken, ChangeUserPWDto, CreateUserDto, RegisterCustomerDto, Token, User, UserDocument, UserProfile } from "./user.model";
import * as bcrypt from "bcrypt";
import { UserRoleService } from "src/user-role/user-role.service";

import { CreateUserRoleDto } from "src/user-role/user-role.model";

import { UserRole } from "src/user-role/user-role.model";
import { TokenDocument } from "src/auth/token.model";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private userModel: Model<UserDocument>,
    @InjectModel("RefreshToken") private refreshTokenModel: Model<RefreshTokenDocument>,
    @Inject(forwardRef(() => UserRoleService)) private readonly userRoleService: UserRoleService,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {}

  async teacherRegister(userDto: RegisterCustomerDto): Promise<User> {
    try {
      delete userDto["userRole"];
      delete userDto["confirmNewPassword"];
      userDto.activated = false;
      let userRole = await this.userRoleService.findByName("Teacher");
      userDto.userRole = new Types.ObjectId(userRole._id);
      let salt = await bcrypt.genSalt();
      let password = await bcrypt.hash(userDto.password, salt);
      userDto.password = password;
      let createdUser = await this.userModel.create(userDto);
      await this.authService.generateAndSendActivationToken(createdUser.username);
      return createdUser;
    } catch (ex) {
      console.log(ex);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error while createion try again!",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async studentRegister(userDto: RegisterCustomerDto): Promise<User> {
  //   try {
  //     delete userDto["userRole"];
  //     delete userDto["confirmNewPassword"];
  //     userDto.activated = false;
  //     let userRole = await this.userRoleService.findByName("Student");
  //     userDto.userRole = new Types.ObjectId(userRole._id);
  //     let salt = await bcrypt.genSalt();
  //     let password = await bcrypt.hash(userDto.password, salt);
  //     userDto.password = password;
  //     let createdUser = await this.userModel.create(userDto);
  //     await this.authService.generateAndSendActivationToken(createdUser.username);
  //     return createdUser;
  //   } catch (ex) {
  //     console.log(ex);
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.BAD_REQUEST,
  //         error: "Error while createion try again!",
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  async createUser(userDto: CreateUserDto): Promise<User> {
    let salt = await bcrypt.genSalt();
    let password = await bcrypt.hash(userDto.password, salt);
    userDto.password = password;
    let createdUser = await this.userModel.create(userDto);
    return createdUser;
  }

  async findById(id: string): Promise<UserProfile> {
    let userFromDb = await this.userModel.findById(id).populate("userRole").lean().exec();
    delete userFromDb.password;
    let userProfile = userFromDb as UserProfile;
    return userProfile;
  }
  async findAll(): Promise<User[]> {
    return await this.userModel.find().populate("userRole").lean().exec();
  }

  async findByUsername(username: string): Promise<User> {
    let user = await this.userModel.findOne({ username: username }).populate("userRole").lean().exec();
    return user;
  }

  async remove(id: string) {
    try {
      await this.userModel.deleteOne({ _id: id });
    } catch (ex) {
      console.log("Error delete user", ex);
    }
  }

  async findRefreshTokenByToken(refreshToken: string) {
    let result = await this.refreshTokenModel.findOne({ refreshToken: refreshToken }).populate("user").lean();
    return result;
  }

  async findRefreshTokenByTokenAndUserId(refreshToken: string, userId: string) {
    let result = await this.refreshTokenModel
      .findOne({ refreshToken: refreshToken, user: new Types.ObjectId(userId) })
      .populate("user")
      .lean();
    return result;
  }

  async createRefreshToken(refreshToken: string, userId: string, expirationDate: Date = null): Promise<RefreshToken> {
    let token = await this.refreshTokenModel.create({ refreshToken: refreshToken, user: userId });
    return token;
  }

  async changeUserPassword(userPwDto: ChangeUserPWDto, userId: string) {
    let userFromDb = await this.userModel.findById(userId).exec();
    const isMatchCurrentPw = await bcrypt.compare(userPwDto.currentPassword, userFromDb.password);
    if (!isMatchCurrentPw) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Your current password is not correct!",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (userPwDto.currentPassword === userPwDto.newPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "You already have that password!",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (userPwDto.newPassword !== userPwDto.confirmNewPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "New passwords doesn't match!",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (isMatchCurrentPw && userPwDto.newPassword === userPwDto.confirmNewPassword) {
      let salt = await bcrypt.genSalt();
      let password = await bcrypt.hash(userPwDto.newPassword, salt);
      userFromDb.password = password;
      return await userFromDb.save();
    }
  }

  async resetPassword(userId: Types.ObjectId, newPassword: string) {
    let userFromDb = await this.userModel.findById(userId + "").exec();
    let salt = await bcrypt.genSalt();
    let password = await bcrypt.hash(newPassword, salt);
    userFromDb.password = password;
    await userFromDb.save();
  }

  async activateUser(userId: Types.ObjectId) {
    let userFromDb = await this.userModel.findById(userId + "").exec();
    userFromDb.activated = true;

    return await userFromDb.save();
  }

  async removeRefreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      return await this.refreshTokenModel.remove({ refreshToken: refreshTokenDto.refreshToken });
    } catch (e) {
      console.log("Error in removeRefreshToken", e);
    }
  }

  async userNameValidaton(userName: string) {
    let userExits = await this.userModel.exists({ username: userName });
    if (userExits) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Username already exist!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async findUserByEmail(email: string) {
    let userFromDb = await this.userModel.findOne({ email: email }).lean().exec();
    return userFromDb;
  }

  async findUserByUsername(username: string) {
    let userFromDb = await this.userModel.findOne({ username: username }).lean().exec();
    return userFromDb;
  }

  async emailValidaton(email: string) {
    let userExits = await this.userModel.exists({ email: email });
    if (userExits) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Email already exist!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
