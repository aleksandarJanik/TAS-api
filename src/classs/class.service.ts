import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "src/user/user.service";
import { Class, ClassDocument, ClassDto } from "./class.model";
import { Student, StudentDto } from "./student.model";

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

  async createStudent(studentDto: StudentDto, classId: string): Promise<Class> {
    try {
      let classFromDb = await this.classModel.findById(classId).exec();

      classFromDb.students.push(studentDto as Student);
      let savedClass = await classFromDb.save();
      return savedClass;
    } catch (ex) {
      console.log("Error create Student", ex);
    }
  }

  async findAllStudents(classId: string): Promise<Student[]> {
    let classFromDb = await this.classModel.findById(classId).lean().exec();
    return classFromDb.students;
  }

  async updateStudent(studentDto: StudentDto, studentId: string, classId: string): Promise<Class> {
    try {
      let classFromDb = await this.classModel.findById(classId);
      let student = classFromDb.students.find((stu) => stu._id + "" === studentId);
      if (student) {
        student.email = studentDto.email;
        student.firstName = studentDto.firstName;
        student.lastName = studentDto.lastName;
        let savedClass = await classFromDb.save();
        return savedClass;
      } else {
        throw new Error("Invalid studentId!");
      }
    } catch (ex) {
      console.log("Error update student", ex);
    }
  }

  async removeStudent(classId: string, studentId: string): Promise<Student> {
    let studentToDelete;
    try {
      let classFromDb = await this.classModel.findById(classId);
      let studentIndex = classFromDb.students.findIndex((stu) => stu._id + "" === studentId);
      studentToDelete = classFromDb.students[studentIndex];
      classFromDb.students.splice(studentIndex, 1);
      await classFromDb.save();
    } catch (ex) {
      console.log("Error delete Student", ex);
    }
    return studentToDelete;
  }
}
