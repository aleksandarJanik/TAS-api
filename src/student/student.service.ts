import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserService } from "src/user/user.service";
import { Student, StudentDocument, StudentDto } from "./student.model";

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}
  async createStudent(studentDto: StudentDto): Promise<Student> {
    try {
      let createdStudent = await this.studentModel.create(studentDto);
      return createdStudent;
    } catch (e) {
      console.log("createStudent", e);
    }
  }

  async findAllStudents(classId: string): Promise<Student[]> {
    let students = await this.studentModel
      .find({ class: new Types.ObjectId(classId) })
      .lean()
      .exec();
    return students;
  }

  async findByid(studentId: string) {
    let student = await this.studentModel.findById(studentId).lean().exec();
    return student;
  }

  async updateStudent(studentDto: StudentDto, studentId: string, classId: string): Promise<Student> {
    try {
      let studentFromDb = await this.studentModel.findById(studentId);
      if (studentFromDb) {
        studentFromDb.email = studentDto.email;
        studentFromDb.firstName = studentDto.firstName;
        studentFromDb.lastName = studentDto.lastName;
        let savedStudent = await studentFromDb.save();
        return savedStudent;
      } else {
        throw new Error("Invalid studentId!");
      }
    } catch (ex) {
      console.log("Error update student", ex);
    }
  }

  async removeStudent(studentId: string) {
    try {
      return await this.studentModel.deleteOne({ _id: studentId });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "User not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
