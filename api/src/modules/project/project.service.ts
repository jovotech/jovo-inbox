import { Injectable } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from 'jovo-inbox-core';
import { getRepository } from 'typeorm';
import { ProjectEntity } from '../../entity/project.entity';

@Injectable()
export class ProjectService {
  constructor() {}
  async createProject(dto: CreateProjectDto) {
    const existingProjectId = await getRepository(ProjectEntity).findOne({
      where: { id: dto.id },
    });

    if (existingProjectId) {
      throw new Error('Project already exists');
    }

    const project = new ProjectEntity();
    project.id = dto.id;
    project.name = dto.name;
    project.createdAt = new Date();
    project.updatedAt = new Date();

    return getRepository(ProjectEntity).save(project);
  }

  async updateProject(projectId: string, dto: UpdateProjectDto) {
    const project = await getRepository(ProjectEntity).findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error("Project doesn't exists");
    }

    if (projectId !== dto.id) {
      const existingProjectId = await getRepository(ProjectEntity).findOne({
        where: { id: dto.id },
      });

      if (existingProjectId) {
        throw new Error("Project doesn't exists");
      }
    }

    project.id = dto.id;
    project.name = dto.name;

    // TODO: change inbox logs project id

    return getRepository(ProjectEntity).save(project);
  }

  async deleteProject(projectId: string) {
    const project = await getRepository(ProjectEntity).findOne({
      where: { id: projectId },
    });

    // todo: delete all logs for this project

    return getRepository(ProjectEntity).remove(project);
  }
}
