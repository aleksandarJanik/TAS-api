import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Types, Document } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/user.model";
import { Exam } from "src/exam/exam.model";

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  message: string;

  @ApiProperty({ type: Boolean })
  @Prop({ default: true })
  isNew: boolean;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: "User", index: true })
  user: User | Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: "Exam", index: true })
  quiz: Exam | Types.ObjectId;

  @Prop({ index: true })
  createdAt: Date;

  @Prop({ index: true })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

export class NotificationDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  message: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  isNew: boolean;

  user: Types.ObjectId;

  quiz: Types.ObjectId;
}
