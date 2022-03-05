import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Exam, ExamDto, UpdateSettingsExamDto } from "./exam.model";
import { ExamService } from "./exam.service";
import { Question, QuestionCreateDto, QuestionUpdateDto } from "./question.model";

@ApiTags("Exam")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("exam")
export class ExamController {
  constructor(private readonly examService: ExamService) {}
  @ApiOperation({ summary: "Create new Exam" })
  @ApiCreatedResponse({ description: "The Exam has been successfully created", type: Exam })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: ExamDto })
  @Roles("Teacher")
  @Post("")
  async create(@Body() examDto: ExamDto, @Req() req): Promise<Exam> {
    return await this.examService.create(examDto, req.user);
  }

  @ApiOperation({ summary: "Find Exams by id" })
  @ApiOkResponse({ description: "The Exam has been successfully returned", type: Exam })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get(":examId")
  async findOne(@Req() req, @Param("examId") examId: string): Promise<Exam> {
    return await this.examService.findOne(examId, req.user);
  }

  @ApiOperation({ summary: "Find all Exams by user" })
  @ApiOkResponse({ description: "The Exam list has been successfully returned", type: [Exam] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get()
  async findAll(@Req() req): Promise<Exam[]> {
    return await this.examService.findAll(req.user);
  }

  @ApiOperation({ summary: "Remove Exam by id" })
  @ApiOkResponse({ description: "The Exam has been successfully removed", type: Exam })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req) {
    return await this.examService.remove(id, req.user);
  }

  @ApiOperation({ summary: "Update Exam by id" })
  @ApiOkResponse({ description: "The Exam has been successfully updated", type: Exam })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: ExamDto })
  @Roles("Teacher")
  @Put(":id")
  async update(@Body() examDto: ExamDto, @Param("id") id: string, @Req() req): Promise<Exam> {
    return await this.examService.update(examDto, id, req.user);
  }

  @ApiOperation({ summary: "Update Description by id" })
  @ApiOkResponse({ description: "The Description has been successfully updated", type: Exam })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: Object })
  @Roles("Teacher")
  @Put(":id/description")
  async updateDescription(@Body() description, @Param("id") id: string, @Req() req): Promise<Exam> {
    return await this.examService.updateDescription(description.desc, id, req.user);
  }

  @ApiOperation({ summary: "Update Title by id" })
  @ApiOkResponse({ description: "The Title has been successfully updated", type: Exam })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: Object })
  @Roles("Teacher")
  @Put(":id/title")
  async updatetitle(@Body() title, @Param("id") id: string, @Req() req): Promise<Exam> {
    return await this.examService.updateTitle(title.title, id, req.user);
  }

  @ApiOperation({ summary: "Create new Question" })
  @ApiOkResponse({ description: "The Question has been successfully created", type: Exam })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: QuestionCreateDto })
  @Post(":examId/question")
  async createQuestion(@Body() questionDto: QuestionCreateDto, @Param("examId") examId: string): Promise<Exam> {
    return await this.examService.createQuestion(questionDto, examId);
  }

  @ApiOperation({ summary: "Find all questions by exam" })
  @ApiOkResponse({ description: "The question list has been successfully returned", type: [Question] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Get(":examId/questions")
  async findAllQuestions(@Param("examId") examId: string): Promise<Question[]> {
    return await this.examService.findAllQuestions(examId);
  }

  @ApiOperation({ summary: "Update Question by id" })
  @ApiOkResponse({ description: "The Question has been successfully updated", type: Question })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: QuestionUpdateDto })
  @Put(":examId/question/:questionId")
  async updateQuestion(@Body() questionDto: QuestionUpdateDto, @Param("questionId") questionId: string, @Param("examId") examId: string): Promise<Exam> {
    return await this.examService.updateQuestion(questionDto, questionId, examId);
  }

  @ApiOperation({ summary: "Remove Question by id" })
  @ApiOkResponse({ description: "The Question has been successfully removed", type: Question })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Delete(":examId/question/:questionId")
  async removeQuestion(@Param("examId") examId: string, @Param("questionId") questionId: string, @Req() req) {
    return await this.examService.removeQuestion(examId, questionId, req.user);
  }

  @ApiOperation({ summary: "Update Settings for exam" })
  @ApiOkResponse({ description: "The Settings has been successfully updated", type: Exam })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: UpdateSettingsExamDto })
  @Put(":examId/settings")
  async updateExamSettings(@Body() updateSettingsExamDto: UpdateSettingsExamDto, @Param("examId") examId: string, @Req() req): Promise<Exam> {
    return await this.examService.updateExamSettings(updateSettingsExamDto, examId, req.user);
  }
}
