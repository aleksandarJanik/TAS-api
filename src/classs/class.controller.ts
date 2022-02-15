import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse, ApiOkResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateUserDto } from "src/user/user.model";
import { Class, ClassDto, ClassWithStats } from "./class.model";
import { ClassService } from "./class.service";
import { Student, StudentDto } from "../student/student.model";

@ApiTags("Class")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("class")
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @ApiOperation({ summary: "Create new Class" })
  @ApiCreatedResponse({ description: "The Class has been successfully created", type: Class })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: ClassDto })
  @Roles("Teacher")
  @Post()
  async createUser(@Body() classDto: ClassDto, @Req() req): Promise<Class> {
    return await this.classService.createClass(classDto, req.user);
  }

  @ApiOperation({ summary: "Find all Classes by user" })
  @ApiOkResponse({ description: "The Class list has been successfully returned", type: [Class] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get()
  async findAll(@Req() req): Promise<Class[]> {
    return await this.classService.findAll(req.user);
  }
  @ApiOperation({ summary: "Find all Classes by user with stats" })
  @ApiOkResponse({ description: "The Class list has been successfully returned", type: [ClassWithStats] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get("with-statistics")
  async findAllWithStatistics(@Req() req): Promise<ClassWithStats[]> {
    return await this.classService.findAllWtihStatistics(req.user);
  }

  @ApiOperation({ summary: "Find Class by id" })
  @ApiOkResponse({ description: "The Class has been successfully returned", type: [Class] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get(":id")
  async findById(@Req() req, @Param("id") id: string): Promise<Class> {
    return await this.classService.findById(id);
  }

  @ApiOperation({ summary: "Remove Class by id" })
  @ApiOkResponse({ description: "The Class has been successfully removed", type: Class })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req) {
    return await this.classService.remove(id, req.user);
  }

  @ApiOperation({ summary: "Update Class by id" })
  @ApiOkResponse({ description: "The Class has been successfully updated", type: Class })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: ClassDto })
  @Roles("Teacher")
  @Put(":id")
  async update(@Body() classDto: ClassDto, @Param("id") id: string, @Req() req): Promise<Class> {
    return await this.classService.update(classDto, id, req.user);
  }
}
