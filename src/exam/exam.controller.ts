import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Exam, ExamDto } from "./exam.model";
import { ExamService } from "./exam.service";
import { Question, QuestionDto } from "./question.model";

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
  @Post("/create")
  async create(@Body() examDto: ExamDto, @Req() req): Promise<Exam> {
    return await this.examService.create(examDto, req.user);
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

  @ApiOperation({ summary: "Create new Question" })
  @ApiOkResponse({ description: "The Question has been successfully created", type: Question })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: QuestionDto })
  @Post(":examId/question")
  async createQuestion(@Body() questionDto: QuestionDto, @Param("examId") examId: string): Promise<Exam> {
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
  @ApiBody({ type: QuestionDto })
  @Put(":examId/question/:questionId")
  async updateQuestion(@Body() questionDto: QuestionDto, @Param("questionId") questionId: string, @Param("examId") examId: string): Promise<Exam> {
    return await this.examService.updateQuestion(questionDto, questionId, examId);
  }

  @ApiOperation({ summary: "Remove Question by id" })
  @ApiOkResponse({ description: "The Question has been successfully removed", type: Question })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Delete(":examId/question/:questionId")
  async removeQuestion(@Param("examId") examId: string, @Param("questionId") questionId: string) {
    return await this.examService.removeQuestion(examId, questionId);
  }
}
