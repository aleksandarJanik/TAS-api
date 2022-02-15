import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ClassService } from "src/classs/class.service";
import { StudentService } from "src/student/student.service";
import { UserService } from "src/user/user.service";
import { Presence, PresenceDocument, PresenceDto } from "./presence.model";

@Injectable()
export class PresenceService {
  constructor(
    @InjectModel(Presence.name) private presenceModel: Model<PresenceDocument>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject(forwardRef(() => ClassService)) private readonly classService: ClassService,
    @Inject(forwardRef(() => StudentService)) private readonly studentService: StudentService,
  ) {}

  async create(presenceDto: PresenceDto, user): Promise<Presence> {
    let userFromDb = await this.userService.findById(user._id);
    if (!userFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Presence not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    let classFromDb = await this.classService.findById(presenceDto.class + "");
    if (classFromDb.user + "" === userFromDb._id + "") {
      let createdPresence = await this.presenceModel.create(presenceDto);
      return createdPresence;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "You are not allowed to create activity!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async findAll(studentId, user): Promise<Presence[]> {
    let userFromDb = await this.userService.findById(user._id);

    return await this.presenceModel
      .find({ student: new Types.ObjectId(studentId) })
      .lean()
      .exec();
  }

  async remove(classId: string, presenceId: string, studentId: string, user) {
    let userFromDb = await this.userService.findById(user._id);
    let classFromDb = await this.classService.findById(classId);
    if (classFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "You are not allowed to remove activity!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (!classFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Class not found!!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    let studentFromDb;
    if (!studentFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Student not found!!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    let presenceFromDb = await this.presenceModel.findById(presenceId);
    if (!presenceFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Presence not found!!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return await presenceFromDb.deleteOne({ _id: presenceId });
  }

  async update(presenceDto: PresenceDto, presenceId: string, user): Promise<Presence> {
    let userFromDb = await this.userService.findById(user._id);
    let presenceFromDb = await this.presenceModel.findById(presenceId);
    let classFromDb = await this.classService.findById(presenceDto.class + "");
    if (classFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    } else {
      presenceFromDb.isPresent = presenceDto.isPresent;
      return await presenceFromDb.save();
    }
  }
}
