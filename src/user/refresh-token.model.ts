import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { Types } from "mongoose";
import { User } from "./user.model";

const EXP_DAYS = 7;

export type RefreshTokenDocument = RefreshToken & Document;

@Schema()
export class RefreshToken {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ unique: true })
  refreshToken: string;

  @ApiProperty({ type: User })
  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  user: Types.ObjectId | User;

  @ApiProperty({ type: Date })
  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Prop({ type: Date, default: getDateInFutureMinutes(24 * 60 * EXP_DAYS), index: { expireAfterSeconds: 0 } })
  expireAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.pre("save", function (next) {
  // @ts-ignore
  this.user = this.user ? Types.ObjectId(this.user) : this.user;
  next();
});

function getDateInFutureMinutes(minutesToAdd): Date {
  let currentDate = new Date();
  let futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
  return futureDate;
  // let date = new Date();
  // date.setDate(date.getDate() + 7);
  // return date;
}

export class RefreshTokenCreateDto {
  @ApiProperty({ type: String })
  @IsString()
  user: string;

  @ApiProperty({ type: String })
  @IsString()
  refreshToken: string;
}

export class RefreshTokenDto {
  @ApiProperty({ type: String, minLength: 20, maxLength: 20 })
  @IsString()
  @Length(20, 20)
  refreshToken: string;
}
