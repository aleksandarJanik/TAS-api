import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse, ApiOkResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateUserDto } from "src/user/user.model";
import { Class, ClassDto } from "./class.model";
import { ClassService } from "./class.service";
import { Student, StudentDto } from "./student.model";

@ApiTags("Class")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("classs")
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @ApiOperation({ summary: "Create new Class" })
  @ApiCreatedResponse({ description: "The Class has been successfully created", type: Class })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: ClassDto })
  @Roles("Teacher")
  @Post("/create")
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

  @ApiOperation({ summary: "Create new Student" })
  @ApiOkResponse({ description: "The Student has been successfully created", type: Student })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: StudentDto })
  @Post(":classId/student")
  async createStudent(@Body() studentDto: StudentDto, @Param("classId") classId: string): Promise<Class> {
    return await this.classService.createStudent(studentDto, classId);
  }

  @ApiOperation({ summary: "Find all students by bulk class" })
  @ApiOkResponse({ description: "The student list has been successfully returned", type: [Student] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Get(":classId/students")
  async findAllStudents(@Param("classId") classId: string): Promise<Student[]> {
    return await this.classService.findAllStudents(classId);
  }

  @ApiOperation({ summary: "Update Student by id" })
  @ApiOkResponse({ description: "The Student has been successfully updated", type: Student })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: StudentDto })
  @Put(":classId/student/:studentId")
  async updateStudent(@Body() studentDto: StudentDto, @Param("studentId") studentId: string, @Param("classId") classId: string): Promise<Class> {
    return await this.classService.updateStudent(studentDto, studentId, classId);
  }

  @ApiOperation({ summary: "Remove Student by id" })
  @ApiOkResponse({ description: "The Student has been successfully removed", type: Student })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Delete(":classId/student/:studentId")
  async removeStudent(@Param("classId") classId: string, @Param("studentId") studentId: string) {
    return await this.classService.removeStudent(classId, studentId);
  }
}
