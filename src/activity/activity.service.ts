import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ClassService } from "src/classs/class.service";
import { StudentService } from "src/student/student.service";
import { UserService } from "src/user/user.service";
import { Activity, ActivityDocument, ActivityDto } from "./activity.model";

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject(forwardRef(() => ClassService)) private readonly classService: ClassService,
  ) // @Inject(forwardRef(() => StudentService)) private readonly studentService: StudentService,
  {}

  async create(activityDto: ActivityDto, user): Promise<Activity> {
    let userFromDb = await this.userService.findById(user._id);
    if (!userFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    let classFromDb = await this.classService.findById(activityDto.class + "");
    if (classFromDb.user + "" === userFromDb._id + "") {
      let createdActivity = await this.activityModel.create(activityDto);
      return createdActivity;
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

  async findAll(studentId, user): Promise<Activity[]> {
    return await this.activityModel
      .find({ student: new Types.ObjectId(studentId) })
      .lean()
      .exec();
  }

  async remove(classId: string, activityId: string, studentId: string, user) {
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
          error: "class not found!!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    let studentFromDb;
    if (!studentFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "student not found!!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    let activityFromDb = await this.activityModel.findById(activityId);
    if (!activityFromDb) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Activity not found!!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return await activityFromDb.deleteOne({ _id: activityId });
  }

  async update(activityDto: ActivityDto, activityId: string, user): Promise<Activity> {
    let userFromDb = await this.userService.findById(user._id);
    let activityFromDb = await this.activityModel.findById(activityId);
    let classFromDb = await this.classService.findById(activityDto.class + "");
    if (classFromDb.user + "" !== userFromDb._id + "") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Not permissions!!",
        },
        HttpStatus.FORBIDDEN,
      );
    } else {
      activityFromDb.name = activityDto.name;
      activityFromDb.grade = activityDto.grade;
      return await activityFromDb.save();
    }
  }
}
