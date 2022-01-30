import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "src/user/user.service";
import { Class, ClassDocument, ClassDto } from "./class.model";
import { Student, StudentDto } from "../student/student.model";

@Injectable()
export class ClassService {
  constructor(@InjectModel(Class.name) private classModel: Model<ClassDocument>, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}
  async createClass(classDto: ClassDto, user) {
    let userFromDb = await this.userService.findById(user._id);
    if (!userFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "User not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    classDto.school = userFromDb.school;
    classDto.user = userFromDb._id;
    let createdClass = await this.classModel.create(classDto);
    return createdClass;
  }

  async findAll(user): Promise<Class[]> {
    let userFromDb = await this.userService.findById(user._id);
    return await this.classModel.find({ user: userFromDb._id }).lean().exec();
  }

  async findById(classId: string): Promise<Class> {
    return await this.classModel.findById(classId).lean().exec();
  }

  async remove(id: string, user) {
    let userFromDb = await this.userService.findById(user._id);
    let classFromDb = await this.classModel.findById(id);
    if (classFromDb.user + "" === userFromDb._id + "") {
      return await this.classModel.deleteOne({ _id: id });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "User not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(classDto: ClassDto, classId: string, user): Promise<Class> {
    let userFromDb = await this.userService.findById(user._id);
    let classFromDb = await this.classModel.findById(classId);
    if (classFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "User not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    } else {
      classFromDb.name = classDto.name;
      return await classFromDb.save();
    }
  }
}
