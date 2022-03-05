import { Body, Controller, Delete, Get, Param, Post, Put, Redirect, Render, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guard";

import { Response } from "express";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { NoteService } from "./note.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { HttpExceptionAnotated } from "src/common/global-models/exception";
import { Note, NoteDto } from "./note.model";

@ApiTags("note")
@UseGuards(RolesGuard)
@ApiBearerAuth("jwt")
@Controller("note")
export class OptionController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: "Create new Note" })
  @ApiCreatedResponse({ description: "The Note has been successfully created", type: Note })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: NoteDto })
  @Roles("Teacher")
  @Post()
  async createUser(@Body() noteDto: NoteDto, @Req() req): Promise<Note> {
    return await this.noteService.upsert(noteDto, req.user);
  }

  @ApiOperation({ summary: "Find all Notes by user" })
  @ApiOkResponse({ description: "The Notes list has been successfully returned", type: [Note] })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Get()
  async findAll(@Req() req): Promise<Note[]> {
    return await this.noteService.findAll(req.user);
  }

  @ApiOperation({ summary: "Remove Note by id" })
  @ApiOkResponse({ description: "The Note has been successfully removed", type: Note })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @Roles("Teacher")
  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req) {
    return await this.noteService.remove(id, req.user);
  }

  @ApiOperation({ summary: "Update Note by id" })
  @ApiOkResponse({ description: "The Note has been successfully updated", type: Note })
  @ApiUnauthorizedResponse({ description: "Not Logged In!", type: HttpExceptionAnotated })
  @ApiBody({ type: NoteDto })
  @Roles("Teacher")
  @Put(":id")
  async update(@Body() noteDto: NoteDto, @Param("id") id: string, @Req() req): Promise<Note> {
    return await this.noteService.upsert(noteDto, req.user, id);
  }
}
