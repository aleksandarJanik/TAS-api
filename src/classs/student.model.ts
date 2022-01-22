import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
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
  @Prop({ unique: true, index: true })
  email: string;
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
}

export const StudentSchema = SchemaFactory.createForClass(Student);
