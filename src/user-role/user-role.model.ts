import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export type UserRoleDocument = UserRole & Document;

@Schema()
export class UserRole {
  // @Prop()
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ unique: true })
  name: string;
}

export class CreateUserRoleDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({})
  @IsString()
  name: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
