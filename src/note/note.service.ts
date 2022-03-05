import { CACHE_MANAGER, forwardRef, HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap, Options } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, QueryOptions, Types } from "mongoose";
import { UserService } from "src/user/user.service";
import { Note, NoteDocument, NoteDto } from "./note.model";

@Injectable()
export class NoteService {
  private cacheManager: Cache;
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  async upsert(note: NoteDto, user, id: string = "") {
    if (id !== "") {
      let existOption = await this.noteModel.findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(user._id) }).exec();
      existOption.value = note.value;
      let savedOption = await existOption.save();
      return savedOption;
    } else {
      note.user = new Types.ObjectId(user._id);
      let createdOption = this.noteModel.create(note);
      return createdOption;
    }
  }

  async findAll(user): Promise<Note[]> {
    let notes = await this.noteModel
      .find({ user: new Types.ObjectId(user._id) })
      .lean()
      .exec();
    return notes;
  }

  async remove(id: string, user) {
    let note = await this.noteModel.findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(user._id) });
    if (note) {
      return await this.noteModel.deleteOne({ _id: id });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "You are not allowed to remove this note!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
