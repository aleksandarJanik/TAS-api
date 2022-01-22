import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
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

  @Prop({ index: true })
  createdAt: Date;

  @Prop({ index: true })
  updatedAt: Date;
}

export class ExamDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  user: Types.ObjectId;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

ExamSchema.pre("save", function (next) {
  // @ts-ignore
  this.user = this.user ? Types.ObjectId(this.user) : this.user;

  next();
});
