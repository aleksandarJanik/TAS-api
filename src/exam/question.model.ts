import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { UserRole } from "src/user-role/user-role.model";
import { User } from "src/user/user.model";

export enum TypeQuestion {
  SHORT_ANSWER,
  RADIO,
  CHECKBOXES,
  DROPDOWN,
}

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ index: true })
  question: string;

  @ApiProperty({ enum: TypeQuestion })
  @Prop()
  type: TypeQuestion;

  @ApiProperty({ type: [String] })
  @Prop()
  answers: string[];

  @ApiProperty({ type: [String] })
  @Prop()
  correctAnswers: string[];

  @ApiProperty({ type: Boolean })
  @Prop()
  isRequired: boolean;
}

export class QuestionCreateDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  question: string;

  @ApiProperty({ enum: TypeQuestion })
  @IsOptional()
  type: TypeQuestion;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  answers: string[];

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  correctAnswers: string[];

  @ApiProperty({ type: Boolean })
  @IsOptional()
  isRequired: boolean;
}

export class QuestionViewDto {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty({ type: String })
  question: string;

  @ApiProperty({ type: String })
  type: TypeQuestion;

  @ApiProperty({ type: [String] })
  answers: string[];

  @ApiProperty({ type: [String] })
  correctAnswers: string[];

  @ApiProperty({ type: Boolean })
  isRequired: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export class QuestionUpdateDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  type: TypeQuestion;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  answers: string[];

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  correctAnswers: string[];

  @ApiProperty({ type: Boolean })
  @IsOptional()
  isRequired: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
