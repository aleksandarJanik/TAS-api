import { forwardRef, Inject, Injectable, NotFoundException, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserDto } from "src/user/user.model";
import { UserService } from "src/user/user.service";
import { CreateUserRoleDto, UserRole, UserRoleDocument } from "./user-role.model";

@Injectable()
export class UserRoleService implements OnApplicationBootstrap {
  constructor(@InjectModel(UserRole.name) private userRoleModel: Model<UserRoleDocument>, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}
  async onApplicationBootstrap() {
    let userRoleAdmin = await this.userRoleModel.findOne({ name: "Admin" }).lean().exec();
    let userRoleTeacher = await this.userRoleModel.findOne({ name: "Teacher" }).lean().exec();
    let userRoleStudent = await this.userRoleModel.findOne({ name: "Student" }).lean().exec();

    if (!userRoleTeacher) {
      let userRoleDtoTeacher: CreateUserRoleDto = {
        name: "Teacher",
      };
      let userRoleSavedTeacher = await this.userRoleModel.create(userRoleDtoTeacher);
    }
    if (!userRoleStudent) {
      let userRoleDto: CreateUserRoleDto = {
        name: "Student",
      };
      let userRoleStudent = await this.userRoleModel.create(userRoleDto);
    }

    if (!userRoleAdmin) {
      let userRoleDto: CreateUserRoleDto = {
        name: "Admin",
      };
      let userRoleAdmin = await this.userRoleModel.create(userRoleDto);
    }
    userRoleAdmin = await this.userRoleModel.findOne({ name: "Admin" }).lean().exec();
    let userExfled = await this.userService.findByUsername("exfled");
    if (userExfled == null) {
      let user = new CreateUserDto();
      user.username = "exfled";
      user.password = "jovica";
      user.email = "jovicailievski97@gmail.com";
      user.userRole = new Types.ObjectId(userRoleAdmin._id);
      user.firstName = "Jovica";
      user.lastName = "Ilievski";
      await this.userService.createUser(user);
    }
  }

  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    try {
      let result = await this.userRoleModel.create(createUserRoleDto);
      return result;
    } catch (ex) {
      console.log(ex);
    }
  }
  async findAll(): Promise<UserRole[]> {
    let userRoles = (await this.userRoleModel.find({}).lean()) as UserRole[];
    return userRoles;
  }

  async findByName(name: string): Promise<UserRole> {
    let userRoles = (await this.userRoleModel.findOne({ name: name }).lean()) as UserRole;
    return userRoles;
  }

  async remove(id: string) {
    await this.userRoleModel.deleteOne({ _id: id }).lean();
  }

  async update(id: string, userRole: CreateUserRoleDto): Promise<UserRole> {
    const updateUserRole = await this.userRoleModel.findById(id);
    if (!updateUserRole) {
      throw new NotFoundException("Could not find user-role.");
    }
    updateUserRole.name = userRole.name;
    let savedUserRole = await updateUserRole.save();
    return savedUserRole;
  }
}
