import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ClassService } from "src/classs/class.service";
import { FinishedExamDto } from "src/exam/exam.model";
import { ExamService } from "src/exam/exam.service";
import { StudentService } from "src/student/student.service";
import { UserService } from "src/user/user.service";
import { SaveTimeDto, StudentSpecialToken, StudentSpecialTokenDocument, StudentSpecialTokenDto } from "./student-special-token.model";

@Injectable()
export class StudentSpecialTokenService {
  constructor(
    @InjectModel(StudentSpecialToken.name) private studentSpecialTokenModel: Model<StudentSpecialTokenDocument>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject(forwardRef(() => ClassService)) private readonly classService: ClassService,
    @Inject(forwardRef(() => StudentService)) private readonly studentService: StudentService,
    @Inject(forwardRef(() => ExamService)) private readonly examService: ExamService,
  ) {}

  async create(studentSpecialTokenDto: StudentSpecialTokenDto, user): Promise<StudentSpecialToken> {
    let userFromDb = await this.userService.findById(user._id);
    let exam = await this.examService.findOne(studentSpecialTokenDto.exam + "", userFromDb._id);
    if (exam === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "exam not found!!",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    let specialTokenExits = await this.studentSpecialTokenModel
      .findOne({ exam: new Types.ObjectId(studentSpecialTokenDto.exam), class: new Types.ObjectId(studentSpecialTokenDto.class), student: new Types.ObjectId(studentSpecialTokenDto.student) })
      .exec();
    if (specialTokenExits) {
      if (exam.time !== specialTokenExits.time) {
        specialTokenExits.time = exam.time;
        await specialTokenExits.save();
      }
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Token created!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    let student;

    student = await this.studentService.findByid(studentSpecialTokenDto.student + "");
    if (student === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "student not found!!",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (student.class + "" !== studentSpecialTokenDto.class + "") {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "student not belong in the class!!",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    studentSpecialTokenDto.user = userFromDb._id;
    if (exam.time && exam.hasTimeLimit) {
      studentSpecialTokenDto.time = exam.time;
    }

    let createdStudentSpecialToken = await this.studentSpecialTokenModel.create(studentSpecialTokenDto);
    return createdStudentSpecialToken;
  }

  async findById(studentSpecialTokenId: string) {
    try {
      let studentSpecialToken = await this.studentSpecialTokenModel.findById(studentSpecialTokenId).lean().exec();
      if (studentSpecialToken === null) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: "Test ended!!",
          },
          HttpStatus.FORBIDDEN,
        );
      }
      return studentSpecialToken;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Test ended!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  async remove(studentSpecialTokenId: string) {
    try {
      return await this.studentSpecialTokenModel.deleteOne({ _id: new Types.ObjectId(studentSpecialTokenId) });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "studentSpecialToken not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async saveTime(saveTimeDto: SaveTimeDto) {
    let token = await this.studentSpecialTokenModel.findById(saveTimeDto.token);
    token.time = saveTimeDto.time;
    return await token.save();
  }

  finishExam(finishedExamDto: FinishedExamDto) {}
}
