import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProjectDto } from 'jovo-inbox-core';
import { ProjectService } from './project.service';
import { getRepository } from 'typeorm';
import { ProjectEntity } from '../../entity/project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects() {
    return getRepository(ProjectEntity).find();
  }

  @Put()
  createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }

  @Post(':projectId')
  updateProject(
    @Param('projectId') projectId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectService.updateProject(projectId, dto);
  }

  @Delete(':projectId')
  deleteProject(@Param('projectId') projectId: string) {
    return this.projectService.deleteProject(projectId);
  }
}
