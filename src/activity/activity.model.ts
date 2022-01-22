import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";
import { Class } from "src/classs/class.model";
import { Student } from "src/classs/student.model";
import { User } from "src/user/user.model";

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: Number })
  @Prop({})
  grade: number;

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

  @ApiProperty({ type: String })
  @Prop()
  name: string;
}

export class ActivityDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  grade: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  student: Types.ObjectId;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  class: Types.ObjectId;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

ActivitySchema.pre("save", function (next) {
  // @ts-ignore
  this.student = this.student ? Types.ObjectId(this.student) : this.student;

  // @ts-ignore
  this.class = this.class ? Types.ObjectId(this.class) : this.class;

  next();
});
