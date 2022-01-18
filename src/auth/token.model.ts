import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../user/user.model";
import { Types } from "mongoose";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export enum TokenType {
  RESET_PASSWORD = "reset_password",
  ACTIVATE = "activate",
}
export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ unique: true })
  token: string;

  @ApiProperty({ type: User })
  @Prop({ type: Types.ObjectId, ref: "User", index: true })
  user: Types.ObjectId | User;

  @ApiProperty({ type: TokenType })
  @Prop({})
  tokenType: TokenType;

  @ApiProperty({ type: Date })
  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Prop({ type: Date, index: { expireAfterSeconds: 0 } })
  expireAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

export class CreateToken {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  user: Types.ObjectId;

  @IsNotEmpty()
  tokenType: TokenType;

  expireAt: Date;
}

export class ResetPasswordDto {
  @ApiProperty({ type: String })
  @IsString()
  usernameOrEmail: string;
}
