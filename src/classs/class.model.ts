import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { Student, StudentSchema } from "src/classs/student.model";
import { UserRole } from "src/user-role/user-role.model";
import { User } from "src/user/user.model";

export type ClassDocument = Class & Document;

@Schema()
export class Class {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ index: true })
  name: string;

  @ApiProperty({ type: String })
  @Prop({ index: true })
  school: string;

  @ApiProperty({ type: [User] })
  @Prop({ type: Types.ObjectId, ref: "User" })
  user: User | Types.ObjectId;

  @Prop({ type: [StudentSchema], default: [] })
  students: Student[];
}

export class ClassDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  school: string;

  user: Types.ObjectId;
}

export const ClassSchema = SchemaFactory.createForClass(Class);