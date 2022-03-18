import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ExamService } from "src/exam/exam.service";
import { UserService } from "src/user/user.service";
import { Result, ResultDocument, ResultDto } from "./result.model";

@Injectable()
export class ResultService {
  constructor(@InjectModel(Result.name) private resultModel: Model<ResultDocument>, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  async create(resultDto: ResultDto): Promise<Result> {
    // let userFromDb = await this.userService.findById(user._id);
    // if (!userFromDb) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       error: "user not found!!",
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
    // resultDto.user = userFromDb._id;
    let resultCreated = await this.resultModel.create(resultDto);
    return await this.resultModel.findById(resultCreated._id).populate("exam").populate("student");
  }

  async findAll(user, examId: string): Promise<Result[]> {
    let userFromDb = await this.userService.findById(user._id);
    let results = await this.resultModel
      .find({ user: userFromDb._id, exam: new Types.ObjectId(examId) })
      .populate("class")
      .populate("exam")
      .populate("student");
    if (results.length < 1) {
      return [];
    }
    return results;
  }
  async checkIfExamHasResults(user, examId: string): Promise<boolean> {
    let userFromDb = await this.userService.findById(user._id);
    let results = await this.resultModel.find({ user: userFromDb._id, exam: new Types.ObjectId(examId) }).countDocuments();
    console.log(results);
    if (results > 0) {
      return true;
    } else {
      return false;
    }
  }
  async getNamesOfClasses(user, examId: string): Promise<string[]> {
    let userFromDb = await this.userService.findById(user._id);
    let results = await this.resultModel.find({ user: userFromDb._id, exam: new Types.ObjectId(examId) }).distinct("className");
    let classNamesArr: string[] = [];
    for (let name of results) {
      if (name === null) continue;
      classNamesArr.push(name);
    }
    return classNamesArr;
  }
  async remove(id: string, user) {
    try {
      return await this.resultModel.deleteOne({ _id: id, user: new Types.ObjectId(user._id) });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "You are not allowed to remove this result!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
