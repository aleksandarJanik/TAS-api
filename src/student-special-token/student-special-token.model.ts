import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { Class } from "src/classs/class.model";
import { Exam } from "src/exam/exam.model";
import { Student } from "src/student/student.model";
import { User } from "src/user/user.model";

export type StudentSpecialTokenDocument = StudentSpecialToken & Document;

@Schema()
export class StudentSpecialToken {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({})
  email: string;

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

  @ApiProperty({ type: String })
  @Prop()
  time: string;

  //   @ApiProperty({ type: String })
  //   @Prop({ index: true })
  //   token: string;
}

export class StudentSpecialTokenDto {
  //   token: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  student: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  class: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  exam: string;

  time: string;

  user: Types.ObjectId;
}

export class SaveTimeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  time: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  token: string;
}

export const StudentSpecialTokenSchema = SchemaFactory.createForClass(StudentSpecialToken);

StudentSpecialTokenSchema.pre("save", function (next) {
  // @ts-ignore
  this.class = this.class ? Types.ObjectId(this.class) : this.class;
  // @ts-ignore
  this.user = this.user ? Types.ObjectId(this.user) : this.user;
  // @ts-ignore
  this.exam = this.exam ? Types.ObjectId(this.exam) : this.exam;
  // @ts-ignore
  this.student = this.student ? Types.ObjectId(this.student) : this.student;

  next();
});
