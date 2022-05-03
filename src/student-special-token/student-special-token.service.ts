import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ActivityDto } from "src/activity/activity.model";
import { ActivityService } from "src/activity/activity.service";
import { Class } from "src/classs/class.model";
import { ClassService } from "src/classs/class.service";
import { ChoosenQuestion, Exam, FinishedExamDto } from "src/exam/exam.model";
import { ExamService } from "src/exam/exam.service";
import { Question, TypeQuestion } from "src/exam/question.model";
import { NotificationDto } from "src/notification/notification.model";
import { NotificationService } from "src/notification/notification.service";
import { CountingExam, ResultDto } from "src/result/result.model";
import { ResultService } from "src/result/result.service";
import { SocketGateway } from "src/socket-gateway/socket.gateway";
import { Student } from "src/student/student.model";
import { StudentService } from "src/student/student.service";
import { Token } from "src/user/user.model";
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
    @Inject(forwardRef(() => ResultService)) private readonly resultService: ResultService,
    @Inject(forwardRef(() => ActivityService)) private readonly activityService: ActivityService,
    @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => SocketGateway)) private readonly socketGateway: SocketGateway,
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
  async remove(studentSpecialTokenId: string, userId: string) {
    try {
      return await this.studentSpecialTokenModel.deleteOne({ _id: new Types.ObjectId(studentSpecialTokenId), user: new Types.ObjectId(userId) });
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

  async finishExam(finishedExamDto: FinishedExamDto) {
    let token = await this.studentSpecialTokenModel.findById(finishedExamDto.studentSpecialTokenId).populate("class").populate("student").exec();
    let student: Student = token.student as Student;
    let examFromDb = await this.examService.findOne(token.exam + "", token.user);
    let obj: CountingExam = this.countResultsForStudent(finishedExamDto.questions, examFromDb.questions, examFromDb);
    let result: ResultDto = {
      class: token.class._id as Types.ObjectId,
      exam: token.exam as Types.ObjectId,
      user: token.user as Types.ObjectId,
      student: token.student._id as Types.ObjectId,
      questionsFromStudent: finishedExamDto.questions,
      numCorrectAnswers: obj.correctAnswers,
      grade: obj.grade,
      gradePercentage: obj.percentage,
      className: token.class["name"],
    };
    let activityDto: ActivityDto = {
      class: token.class._id as Types.ObjectId,
      grade: obj.grade + "",
      name: examFromDb.name,
      student: token.student._id as Types.ObjectId,
    };
    let notificationDto: NotificationDto = {
      isNew: true,
      message: `Student ${student.firstName} ${student.lastName} finish the exam ${examFromDb.name}`,
      user: token.user as Types.ObjectId,
      quiz: token.exam as Types.ObjectId,
    };
    try {
      await this.remove(token._id + "", token.user + "");
      await this.activityService.create(activityDto, token.user + "");
      let notification = await this.notificationService.create(notificationDto);
      this.socketGateway.emitNotificationReceived(token.user + "", { notification });

      return await this.resultService.create(result);
    } catch (e) {}
  }

  countResultsForStudent(questionsStudent: ChoosenQuestion[], examQuestions: Question[], examFromDb: Exam) {
    let correctAnswers = 0;
    for (let questinStudent of questionsStudent) {
      if (questinStudent.answers.length === 0) {
        continue;
      }
      let questionFromExam = examQuestions.find((q) => q._id + "" === questinStudent.questionId);
      if (!questionFromExam) {
        console.log("question doesnt exis in exam");
        continue;
      }
      if (questionFromExam.type !== TypeQuestion.CHECKBOXES) {
        let isCorrect = questionFromExam.correctAnswers.some((answer) => answer === questinStudent.answers[0]);
        if (isCorrect) {
          correctAnswers++;
          questinStudent.isCorrect = true;
        } else {
          questinStudent.isCorrect = false;
        }
      } else {
        if (questinStudent.answers.length !== questionFromExam.correctAnswers.length) {
          questinStudent.isCorrect = false;
          continue;
        }
        let allCorrect = true;
        for (let a of questinStudent.answers) {
          let isCorrect = questionFromExam.correctAnswers.some((answer) => answer === a);
          if (!isCorrect) {
            allCorrect = false;
          }
        }
        if (allCorrect) {
          correctAnswers++;
          questinStudent.isCorrect = true;
        } else {
          questinStudent.isCorrect = false;
        }
      }
    }
    let percentage = (correctAnswers / examQuestions.length) * 100;
    let grade;
    if (examFromDb.grade1 >= percentage && examFromDb.grade2 > percentage) {
      grade = 1;
    } else if (examFromDb.grade2 >= percentage && examFromDb.grade3 > percentage) {
      grade = 2;
    } else if (examFromDb.grade3 >= percentage && examFromDb.grade4 > percentage) {
      grade = 3;
    } else if (examFromDb.grade4 >= percentage && examFromDb.grade5 > percentage) {
      grade = 4;
    } else if (examFromDb.grade5 <= percentage) {
      grade = 5;
    }

    // console.log("grade", grade);
    // console.log("percentage", percentage);
    // console.log("correctAnswers", correctAnswers);
    let countingExam: CountingExam = {
      correctAnswers: correctAnswers,
      grade: grade,
      percentage: percentage,
    };
    return countingExam;
  }
}
