import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { Activity } from "src/activity/activity.model";
import { Class } from "src/classs/class.model";
import { EmailExists } from "src/common/decorators/emailExist.decorator";
import { UserRole } from "src/user-role/user-role.model";
import { User } from "src/user/user.model";

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ type: String })
  @Prop({ index: true })
  email: string;

  @ApiProperty({ type: [Class] })
  @Prop({ type: Types.ObjectId, ref: "Class" })
  class: Class | Types.ObjectId;

  activities: Activity[];
}

export class StudentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @EmailExists()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  user: Types.ObjectId;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre("save", function (next) {
  // @ts-ignore
  this.class = this.class ? Types.ObjectId(this.class) : this.class;

  next();
});
