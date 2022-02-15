import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "src/user/user.service";
import { Class, ClassDocument, ClassDto, ClassWithStats } from "./class.model";
import { Student, StudentDto } from "../student/student.model";
import { StudentService } from "src/student/student.service";

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject(forwardRef(() => StudentService)) private readonly studentService: StudentService,
  ) {}
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

  async findAllWtihStatistics(user) {
    let userFromDb = await this.userService.findById(user._id);
    let classes = await this.classModel.find({ user: userFromDb._id }).lean().exec();
    if (classes) {
      let classesWtihStats: ClassWithStats[] = [];
      // let classesWtihStats: ClassWithStats[] = classes.map(async (classs) => {
      for (let classs of classes) {
        let studens = await this.studentService.findAllStudents(classs._id + "");
        let stNumWithOne = 0,
          stNumWithTwo = 0,
          stNumWithThree = 0,
          stNumWithFour = 0,
          stNumWithfive = 0;
        let avgclass = 0,
          numOfStudents = 0;

        if (studens) {
          for (let s of studens) {
            let flagToCountStudent = false;
            let studentGrade = 0,
              numOfGrades = 0;
            if (s.activities) {
              for (let ac of s.activities) {
                if (!isNaN(Number(ac.grade))) {
                  // console.log(ac.grade, isNaN(Number(ac.grade)));
                  studentGrade += parseInt(ac.grade);
                  numOfGrades++;
                  if (!flagToCountStudent) {
                    numOfStudents++;
                    flagToCountStudent = true;
                  }
                }
              }
              if (studentGrade !== 0) {
                studentGrade = Math.round(studentGrade / numOfGrades);
                // console.log("student grade:", Math.round(studentGrade));
                avgclass += studentGrade;
                if (studentGrade === 1) {
                  stNumWithOne++;
                }
                if (studentGrade === 2) {
                  stNumWithTwo++;
                }
                if (studentGrade === 3) {
                  stNumWithThree++;
                }
                if (studentGrade === 4) {
                  stNumWithFour++;
                }
                if (studentGrade === 5) {
                  stNumWithfive++;
                }
              }
            }
          }
        }
        // console.log("avg class: ", avgclass);
        if (avgclass > 0) {
          avgclass = avgclass / numOfStudents;
          // console.log("avg class after: ", avgclass, numOfStudents);
        } else {
          continue;
        }

        let classWtihStats: ClassWithStats = {
          _id: classs._id,
          name: classs.name,
          school: classs.school,
          user: classs.user,
          averageGrade: avgclass,
          numGradeFive: stNumWithfive,
          numGradeFour: stNumWithFour,
          numGradeThree: stNumWithThree,
          numGradeTwo: stNumWithTwo,
          numGradeOne: stNumWithOne,
        };
        classesWtihStats.push(classWtihStats);
      }

      // console.log(classesWtihStats);
      return classesWtihStats;
    } else {
      console.log("no classes");
    }
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
