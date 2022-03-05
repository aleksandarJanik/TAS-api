import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { OptionController } from "./note.controller";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from "src/user/user.module";
import { Note, NoteSchema } from "./note.model";
import { NoteService } from "./note.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]), forwardRef(() => UserModule)],
  controllers: [OptionController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
