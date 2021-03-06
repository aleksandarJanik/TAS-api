import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { Activity } from "src/activity/activity.model";
import { Class } from "src/classs/class.model";
import { EmailExists } from "src/common/decorators/emailExist.decorator";
import { Result } from "src/result/result.model";
import { StudentSpecialToken } from "src/student-special-token/student-special-token.model";
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

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: "Class", index: true })
  class: Class | Types.ObjectId;

  activities: Activity[];

  results: Result[];

  tokens: StudentSpecialToken[];
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
  class: Types.ObjectId;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre("save", function (next) {
  // @ts-ignore
  this.class = this.class ? Types.ObjectId(this.class) : this.class;

  next();
});

StudentSchema.virtual("activities", {
  ref: "Activity",
  localField: "_id",
  foreignField: "student",
  // populate: ["globalRarity"], // virtual
});

StudentSchema.virtual("results", {
  ref: "Result",
  localField: "_id",
  foreignField: "student",
  // populate: ["globalRarity"], // virtual
});

StudentSchema.virtual("tokens", {
  ref: "StudentSpecialToken",
  localField: "_id",
  foreignField: "student",
  // populate: ["globalRarity"], // virtual
});
