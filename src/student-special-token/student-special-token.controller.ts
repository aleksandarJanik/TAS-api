import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Public } from "src/auth/constants";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { RolesGuard } from "src/common/guards/roles.guard";
import { FinishedExamDto } from "src/exam/exam.model";
import { SaveTimeDto, StudentSpecialToken, StudentSpecialTokenDto } from "./student-special-token.model";
import { StudentSpecialTokenService } from "./student-special-token.service";
@ApiTags("Student-special-token")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("student-special-token")
export class StudentSpecialTokenController {
  constructor(private readonly studentSpecialTokenService: StudentSpecialTokenService) {}
  @ApiOperation({ summary: "Create new Special Token for student" })
  @ApiOkResponse({ description: "The Token has been successfully created", type: [StudentSpecialToken] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: StudentSpecialTokenDto })
  @Post()
  async createStudentSpecialTokens(@Body() studentSpecialTokenDtos: StudentSpecialTokenDto[], @Req() req): Promise<StudentSpecialToken[]> {
    let studentSpecialTokens: StudentSpecialToken[] = [];
    for (let studentSpecialTokenDto of studentSpecialTokenDtos) {
      try {
        let studentSTdto = await this.studentSpecialTokenService.create(studentSpecialTokenDto, req.user);
        studentSpecialTokens.push(studentSTdto);
      } catch (e) {}
    }
    if (studentSpecialTokens.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Test not found!!",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return studentSpecialTokens;
  }
  @Public()
  @ApiOperation({ summary: "Find Special Token for student by id" })
  @ApiOkResponse({ description: "The Special Token for student has been successfully returned", type: StudentSpecialToken })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Get(":specialTokenId")
  async findOne(@Param("specialTokenId") specialTokenId: string): Promise<StudentSpecialToken> {
    return await this.studentSpecialTokenService.findById(specialTokenId);
  }

  @ApiOperation({ summary: "Remove Special Token for student by id" })
  @ApiOkResponse({ description: "The Special Token for student has been successfully removed", type: StudentSpecialToken })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req) {
    return await this.studentSpecialTokenService.remove(id, req.user._id);
  }

  @Public()
  @ApiOperation({ summary: "Save time for token" })
  @ApiOkResponse({ description: "The Token time has been successfully saved", type: [StudentSpecialToken] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: StudentSpecialTokenDto })
  @Post("save-time")
  async saveTime(@Body() saveTimeDto: SaveTimeDto): Promise<StudentSpecialToken> {
    return await this.studentSpecialTokenService.saveTime(saveTimeDto);
  }

  @Public()
  @ApiOperation({ summary: "Finish exam" })
  @ApiOkResponse({ description: "The Exam has been successfully finished", type: [FinishedExamDto] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: FinishedExamDto })
  @Post("finished-exam")
  async finishExam(@Body() finishedExamDto: FinishedExamDto) {
    return await this.studentSpecialTokenService.finishExam(finishedExamDto);
  }
}
