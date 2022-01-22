import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { IsBoolean, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Validate } from "class-validator";

import { UserExistsRule } from "src/common/custom-validators/userExist.validator";
import { UserExists } from "src/common/decorators/userExist.decorator";
import { EmailExists } from "src/common/decorators/emailExist.decorator";
import { Match } from "src/common/decorators/match.decorator";
import { UserRole } from "src/user-role/user-role.model";
import { Exam } from "src/exam/exam.model";
import { Activity } from "src/activity/activity.model";
import { Presence } from "src/presence/presence.model";
import { Class } from "src/classs/class.model";

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ unique: true, index: true })
  username: string;

  @ApiProperty({ type: String })
  @Prop({ unique: true, index: true })
  email: string;

  @ApiProperty({ type: UserRole })
  @Prop({ type: Types.ObjectId, ref: UserRole.name })
  userRole: Types.ObjectId | UserRole;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  subject: string;

  @ApiProperty({ type: Boolean })
  @Prop({ default: false })
  activated: boolean;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  school: string;

  exams: Exam[];

  activities: Activity[];

  presences: Presence[];

  classes: Class[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", function (next) {
  // @ts-ignore
  this.userRole = this.userRole ? Types.ObjectId(this.userRole) : this.userRole;

  next();
});

// UserSchema.pre("findOneAndUpdate", function (next) {

//   next();
// });

export class RegisterCustomerDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @UserExists()
  username: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}/, {
    message: "Password must be at least 8 characters in length, one Lowercase letters, one Uppercase letters, one Number, one Special characters ",
  })
  password: string;

  @ApiProperty({ type: String })
  @Match("password", { message: "New passwords doesn't match!" })
  confirmNewPassword: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @EmailExists()
  email: string;

  userRole: Types.ObjectId;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  school: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  subject: string;

  activated: boolean;
}

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  userRole: Types.ObjectId;
}

export class UserAuthDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  // @IsNotEmpty()
  // email: string;

  // @IsNotEmpty()
  // userRole: UserRole;
}

export class LoginUser {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  password: string;
}

export class TokenWithRefresh {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}

export class Token {
  @ApiProperty({ type: String })
  accessToken: string;
}

export class ChangeUserPWDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}/, {
    message: "Password must be at least 8 characters in length, one Lowercase letters, one Uppercase letters, one Number, one Special characters ",
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}/, {
    message: "Password must be at least 8 characters in length, one Lowercase letters, one Uppercase letters, one Number, one Special characters ",
  })
  confirmNewPassword: string;
}

export class ChangePassowrdWithToken {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}/, {
    message: "Password must be at least 8 characters in length, one Lowercase letters, one Uppercase letters, one Number, one Special characters ",
  })
  newPassword: string;

  @ApiProperty({ type: String })
  @Match("newPassword", { message: "New passwords doesn't match!" })
  confirmNewPassword: string;
}

export class UserProfile {
  _id: Types.ObjectId;

  username: string;

  email: string;

  userRole: UserRole;

  firstName: string;

  lastName: string;

  activated: boolean;

  school: string;

  subject: string;
}

export class AcivateTokenDto {
  userName: string;
}

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

UserSchema.virtual("exams", {
  ref: Exam.name,
  localField: "_id",
  foreignField: "user",
  // populate: ["globalRarity"], // virtual
});

UserSchema.virtual("activities", {
  ref: Activity.name,
  localField: "_id",
  foreignField: "user",
  // populate: ["globalRarity"], // virtual
});

UserSchema.virtual("presences", {
  ref: Presence.name,
  localField: "_id",
  foreignField: "user",
  // populate: ["globalRarity"], // virtual
});

UserSchema.virtual("classes", {
  ref: Class.name,
  localField: "_id",
  foreignField: "user",
  // populate: ["globalRarity"], // virtual
});
