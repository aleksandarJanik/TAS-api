import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Types, Document } from "mongoose";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/user.model";

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  key: string;

  @ApiProperty({ type: String })
  @Prop({})
  value: string;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: "User", index: true })
  user: User | Types.ObjectId;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

export class NoteDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  key: string;

  @ApiProperty({ type: String })
  @IsOptional()
  value: string;

  user: Types.ObjectId;
}
