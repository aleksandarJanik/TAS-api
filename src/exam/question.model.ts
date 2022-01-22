import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { UserRole } from "src/user-role/user-role.model";
import { User } from "src/user/user.model";

export enum QuestionType {
  PARAGRAPH = 5,
  SHORTANSWER = 4,
  DROPDOWN = 3,
  CHECKBOX = 2,
  RADIO = 1,
}

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ index: true })
  question: string;

  @ApiProperty({ enum: QuestionType })
  @Prop()
  type: QuestionType;
}

export class QuestionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({ enum: QuestionType })
  @IsNotEmpty()
  type: QuestionType;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
