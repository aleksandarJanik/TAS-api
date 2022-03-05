import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { Question, QuestionSchema } from "src/exam/question.model";
import { UserRole } from "src/user-role/user-role.model";
import { User } from "src/user/user.model";

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true })
export class Exam {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ index: true })
  name: string;

  @ApiProperty({ type: User })
  @Prop({ type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId | User;

  @ApiProperty({ type: [Question] })
  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];

  @ApiProperty({ type: String })
  @Prop({})
  description: string;

  @Prop({ index: true })
  createdAt: Date;

  @Prop({ index: true })
  updatedAt: Date;

  @ApiProperty({ type: Number })
  @Prop({ index: true, default: 20 })
  grade1: number;

  @ApiProperty({ type: Number })
  @Prop({ index: true, default: 40 })
  grade2: number;

  @ApiProperty({ type: Number })
  @Prop({ index: true, default: 60 })
  grade3: number;

  @ApiProperty({ type: Number })
  @Prop({ index: true, default: 80 })
  grade4: number;

  @ApiProperty({ type: Number })
  @Prop({ index: true, default: 100 })
  grade5: number;

  @ApiProperty({ type: String })
  @Prop({})
  time: string;

  @ApiProperty({ type: Boolean })
  @Prop({ default: false })
  hasTimeLimit: boolean;

  @ApiProperty({ type: Boolean })
  @Prop({ default: true })
  showResutPage: boolean;
}

export class ExamDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  user: Types.ObjectId;
}

export class UpdateSettingsExamDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  grade1: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  grade2: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  grade3: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  grade4: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  grade5: number;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  time: string;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  hasTimeLimit: boolean;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  showResutPage: boolean;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

ExamSchema.pre("save", function (next) {
  // @ts-ignore
  this.user = this.user ? Types.ObjectId(this.user) : this.user;

  next();
});
