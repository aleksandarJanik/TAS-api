import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "src/user/user.service";
import { Exam, ExamDocument, ExamDto } from "./exam.model";
import { Question, QuestionDto } from "./question.model";

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
    let userFromDb = await this.userService.findById(user._id);
    let exams = await this.examModel.find({ user: userFromDb._id }).lean().exec();
    return exams;
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

  async createQuestion(questionDto: QuestionDto, examId: string): Promise<Exam> {
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

  async updateQuestion(questionDto: QuestionDto, questionId: string, examId: string): Promise<Exam> {
    try {
      let examFromDb = await this.examModel.findById(examId);
      let question = examFromDb.questions.find((q) => q._id + "" === questionId);
      if (question) {
        question.question = questionDto.question;
        question.type = questionDto.type;
        let savedExam = await examFromDb.save();
        return savedExam;
      } else {
        throw new Error("Invalid questionId!");
      }
    } catch (ex) {
      console.log("Error update Question", ex);
    }
  }

  async removeQuestion(examId: string, questionId: string): Promise<Question> {
    let questionToDelete;
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
}
