import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Result, ResultDto } from "./result.model";
import { ResultService } from "./result.service";

@ApiTags("Result")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("result")
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  //   @ApiOperation({ summary: "Create new Result" })
  //   @ApiCreatedResponse({ description: "The Result has been successfully created", type: Result })
  //   @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  //   @ApiBody({ type: ResultDto })
  //   @Roles("Teacher")
  //   @Post()
  //   async create(@Body() resultDto: ResultDto, @Req() req): Promise<Result> {
  //     return await this.resultService.create(resultDto, req.user);
  //   }

  @ApiOperation({ summary: "Find all Results by test" })
  @ApiOkResponse({ description: "The Result list has been successfully returned", type: [Result] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get("exam/:examId")
  async findAll(@Req() req, @Param("examId") examId: string): Promise<Result[]> {
    return await this.resultService.findAll(req.user, examId);
  }

  @ApiOperation({ summary: "Remove Result by id" })
  @ApiOkResponse({ description: "The Result has been successfully removed", type: Result })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req) {
    return await this.resultService.remove(id, req.user);
  }

  @ApiOperation({ summary: "Find all names by tests" })
  @ApiOkResponse({ description: "The names of classes has been successfully returned", type: [String] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get("class-names/:examId")
  async getNamesOfClasses(@Req() req, @Param("examId") examId: string): Promise<string[]> {
    return await this.resultService.getNamesOfClasses(req.user, examId);
  }

  @ApiOperation({ summary: "Check If Exam Has Results" })
  @ApiOkResponse({ description: "The boolean has been successfully returned", type: Boolean })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Post("check-exam/:examId")
  async checkIfExamHasResults(@Req() req, @Param("examId") examId: string): Promise<boolean> {
    return await this.resultService.checkIfExamHasResults(req.user, examId);
  }

  //   @ApiOperation({ summary: "Update Result by id" })
  //   @ApiOkResponse({ description: "The Result has been successfully updated", type: Result })
  //   @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  //   @ApiBody({ type: ResultDto })
  //   @Roles("Teacher")
  //   @Put(":id")
  //   async update(@Body() resultDto: ResultDto, @Param("id") id: string, @Req() req): Promise<Result> {
  //     return await this.resultService.update(resultDto, req.user, id);
  //   }
}
