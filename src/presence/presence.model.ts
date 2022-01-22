import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { Class } from "src/classs/class.model";
import { Student } from "src/classs/student.model";
import { Question, QuestionSchema } from "src/exam/question.model";
import { UserRole } from "src/user-role/user-role.model";
import { User } from "src/user/user.model";

export type PresenceDocument = Presence & Document;

@Schema({ timestamps: true })
export class Presence {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: Boolean })
  @Prop({})
  isPresent: boolean;

  @ApiProperty({ type: Class })
  @Prop({ type: Types.ObjectId, ref: "Class" })
  class: Types.ObjectId | Class;

  @ApiProperty({ type: Student })
  @Prop({ type: Types.ObjectId, ref: "Student" })
  student: Types.ObjectId | Student;

  @Prop({ index: true })
  createdAt: Date;

  @Prop({ index: true })
  updatedAt: Date;
}

export class PresenceDto {
  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  isPresent: boolean;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  student: Types.ObjectId;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  class: Types.ObjectId;
}

export const PresenceSchema = SchemaFactory.createForClass(Presence);

PresenceSchema.pre("save", function (next) {
  // @ts-ignore
  this.student = this.student ? Types.ObjectId(this.student) : this.student;

  // @ts-ignore
  this.class = this.class ? Types.ObjectId(this.class) : this.class;

  next();
});
