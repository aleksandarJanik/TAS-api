import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { title } from "process";
import { UserService } from "src/user/user.service";
import { Exam, ExamDocument, ExamDto, UpdateSettingsExamDto } from "./exam.model";
import { Question, QuestionCreateDto, QuestionUpdateDto } from "./question.model";

@Injectable()
export class ExamService {
  constructor(@InjectModel(Exam.name) private examModel: Model<ExamDocument>, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  async create(examDto: ExamDto, user): Promise<Exam> {
    let userFromDb = await this.userService.findById(user._id);
    if (!userFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    examDto.user = userFromDb._id;
    let createdExam = await this.examModel.create(examDto);
    return createdExam;
  }

  async findAll(user): Promise<Exam[]> {
    try {
      let userFromDb = await this.userService.findById(user._id);
      let exams = await this.examModel.find({ user: userFromDb._id }).lean().exec();
      return exams;
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

  async findOne(examId: string, userId) {
    try {
      let exam = await this.examModel
        .findOne({ user: new Types.ObjectId(userId), _id: new Types.ObjectId(examId) })
        .lean()
        .exec();
      return exam;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async remove(examId: string, user) {
    let userFromDb = await this.userService.findById(user._id);
    let examFromDb = await this.examModel.findById(examId);
    if (examFromDb.user + "" === userFromDb._id + "") {
      return await this.examModel.deleteOne({ _id: examId });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(examDto: ExamDto, examId: string, user): Promise<Exam> {
    let userFromDb = await this.userService.findById(user._id);
    let examFromDb = await this.examModel.findById(examId);
    if (examFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    } else {
      examFromDb.name = examDto.name;
      return await examFromDb.save();
    }
  }

  async updateDescription(description: string, examId: string, user): Promise<Exam> {
    let userFromDb = await this.userService.findById(user._id);
    let examFromDb = await this.examModel.findById(examId);
    if (examFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    } else {
      examFromDb.description = description;
      return await examFromDb.save();
    }
  }
  async updateTitle(title: string, examId: string, user): Promise<Exam> {
    let userFromDb = await this.userService.findById(user._id);
    let examFromDb = await this.examModel.findById(examId);
    if (examFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    } else {
      examFromDb.name = title;
      return await examFromDb.save();
    }
  }

  async createQuestion(questionDto: QuestionCreateDto, examId: string): Promise<Exam> {
    try {
      let examFromDb = await this.examModel.findById(examId).exec();
      examFromDb.questions.push(questionDto as Question);
      let savedExam = await examFromDb.save();
      return savedExam;
    } catch (ex) {
      console.log("Error create Question", ex);
    }
  }

  async findAllQuestions(examId: string): Promise<Question[]> {
    let examFromDb = await this.examModel.findById(examId).lean().exec();
    return examFromDb.questions;
  }

  async updateQuestion(questionDto: QuestionUpdateDto, questionId: string, examId: string): Promise<Exam> {
    try {
      let examFromDb = await this.examModel.findById(examId);
      let question = examFromDb.questions.find((q) => q._id + "" === questionId);
      if (question) {
        question.question = questionDto.question;
        question.type = questionDto.type;
        question.answers = questionDto.answers;
        question.correctAnswers = questionDto.correctAnswers;
        question.isRequired = questionDto.isRequired;
        let savedExam = await examFromDb.save();
        return savedExam;
      } else {
        throw new Error("Invalid questionId!");
      }
    } catch (ex) {
      console.log("Error update Question", ex);
    }
  }

  async removeQuestion(examId: string, questionId: string, user): Promise<Question> {
    let questionToDelete;
    let userFromDb = await this.userService.findById(user._id);
    let examFromDb = await this.examModel.findById(examId);
    if (examFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      let examFromDb = await this.examModel.findById(examId);
      let questionIndex = examFromDb.questions.findIndex((q) => q._id + "" === questionId);
      questionToDelete = examFromDb.questions[questionIndex];
      examFromDb.questions.splice(questionIndex, 1);
      await examFromDb.save();
    } catch (ex) {
      console.log("Error delete Question", ex);
    }
    return questionToDelete;
  }

  async updateExamSettings(updateSettingsExamDto: UpdateSettingsExamDto, examId: string, user) {
    let userFromDb = await this.userService.findById(user._id);
    let examFromDb = await this.examModel.findById(examId);
    if (examFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Exam not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (updateSettingsExamDto.time && this.checkValidationForTime(updateSettingsExamDto.time)) {
      examFromDb.time = updateSettingsExamDto.time;
      examFromDb.hasTimeLimit = updateSettingsExamDto.hasTimeLimit;
    }
    examFromDb.grade1 = updateSettingsExamDto.grade1;
    examFromDb.grade2 = updateSettingsExamDto.grade2;
    examFromDb.grade3 = updateSettingsExamDto.grade3;
    examFromDb.grade4 = updateSettingsExamDto.grade4;
    examFromDb.grade5 = updateSettingsExamDto.grade5;
    examFromDb.showResutPage = updateSettingsExamDto.showResutPage;

    return await examFromDb.save();
  }

  checkValidationForTime(time: string) {
    let firstChar = time.split("")[0];
    let secondChar = time.split("")[1];
    let thirdChar = time.split("")[2];
    let fourChar = time.split("")[3];
    let fiveChar = time.split("")[4];
    if (time.split("").length !== 5 || isNaN(parseInt(firstChar)) || isNaN(parseInt(secondChar)) || thirdChar !== ":" || isNaN(parseInt(fourChar)) || isNaN(parseInt(fiveChar))) {
      return false;
    } else return true;
  }
}
