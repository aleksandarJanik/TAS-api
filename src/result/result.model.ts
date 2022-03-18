import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";
import { Class } from "src/classs/class.model";
import { Student } from "src/student/student.model";
import { User } from "src/user/user.model";
import { ChoosenQuestion, Exam } from "../exam/exam.model";

export type ResultDocument = Result & Document;

@Schema({ timestamps: true })
export class Result {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: "Class", index: true })
  class: Class | Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: "User", index: true })
  user: User | Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: "Exam", index: true })
  exam: Exam | Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: "Student", index: true })
  student: Student | Types.ObjectId;

  @ApiProperty({ type: Number })
  @Prop({})
  numCorrectAnswers: number;

  @ApiProperty({ type: Number })
  @Prop({})
  grade: number;

  @ApiProperty({ type: Number })
  @Prop({})
  gradePercentage: number;

  @ApiProperty({ type: [ChoosenQuestion] })
  @Prop({})
  questionsFromStudent: ChoosenQuestion[];

  @ApiProperty({ type: String })
  @Prop({})
  className: string;

  @Prop({ index: true })
  createdAt: Date;

  @Prop({ index: true })
  updatedAt: Date;
}
export class ResultDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  class: Types.ObjectId;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  user: Types.ObjectId;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  exam: Types.ObjectId;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  student: Types.ObjectId;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  numCorrectAnswers: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  grade: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  gradePercentage: number;

  @ApiProperty({ type: [ChoosenQuestion] })
  @IsNotEmpty()
  questionsFromStudent: ChoosenQuestion[];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  className: string;
}

export class CountingExam {
  correctAnswers: number;
  percentage: number;
  grade: number;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
