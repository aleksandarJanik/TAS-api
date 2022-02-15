import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse, ApiOkResponse } from "@nestjs/swagger";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Student, StudentDto } from "./student.model";
import { StudentService } from "./student.service";

@ApiTags("Student")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("student")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @ApiOperation({ summary: "Create new Student" })
  @ApiOkResponse({ description: "The Student has been successfully created", type: Student })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: StudentDto })
  @Post()
  async createStudent(@Body() studentDto: StudentDto, @Req() req): Promise<Student> {
    return await this.studentService.createStudent(studentDto, req.user);
  }

  @ApiOperation({ summary: "Find all students by class" })
  @ApiOkResponse({ description: "The student list has been successfully returned", type: [Student] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Get(":classId")
  async findAllStudents(@Param("classId") classId: string): Promise<Student[]> {
    return await this.studentService.findAllStudents(classId);
  }

  @ApiOperation({ summary: "Find student by id" })
  @ApiOkResponse({ description: "The student has been successfully returned", type: Student })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Get("findOne/:studentId")
  async findbyId(@Param("studentId") studentId: string): Promise<Student> {
    return await this.studentService.findByid(studentId);
  }

  @ApiOperation({ summary: "Update Student by id" })
  @ApiOkResponse({ description: "The Student has been successfully updated", type: Student })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: StudentDto })
  @Put(":studentId")
  async updateStudent(@Body() studentDto: StudentDto, @Param("studentId") studentId: string, @Req() req): Promise<Student> {
    return await this.studentService.updateStudent(studentDto, studentId, req.user);
  }

  @ApiOperation({ summary: "Remove Student by id" })
  @ApiOkResponse({ description: "The Student has been successfully removed", type: Student })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Delete(":studentId/class/:classId")
  async removeStudent(@Param("studentId") studentId: string, @Param("classId") classId: string, @Req() req) {
    return await this.studentService.removeStudent(studentId, classId, req.user);
  }
}
