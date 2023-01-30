import { Injectable } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from 'jovo-inbox-core';
import { getRepository } from 'typeorm';
import { ProjectEntity } from '../../entity/project.entity';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import { InboxLogUserEntity } from '../../entity/inbox-log-user.entity';

@Injectable()
export class ProjectService {
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
      throw new Error("Project doesn't exist");
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

    // update project id in all logs with old project id
    if (projectId !== dto.id) {
      await getRepository(InboxLogEntity)
        .createQueryBuilder()
        .update(InboxLogEntity)
        .set({ projectId: dto.id })
        .where('projectId = :oldProjectId', { oldProjectId: projectId })
        .execute();

      await getRepository(InboxLogUserEntity)
        .createQueryBuilder()
        .update(InboxLogUserEntity)
        .set({ projectId: dto.id })
        .where('projectId = :oldProjectId', { oldProjectId: projectId })
        .execute();
    }
    await getRepository(ProjectEntity).save(project);

    const oldProject = await getRepository(ProjectEntity).findOne({
      where: { id: projectId },
    });
    await getRepository(ProjectEntity).remove(oldProject);

    return project;
  }

  async deleteProject(projectId: string) {
    const project = await getRepository(ProjectEntity).findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error("Project doesn't exist");
    }

    // delete all logs with project id
    await getRepository(InboxLogEntity)
      .createQueryBuilder()
      .delete()
      .where('projectId = :projectId', { projectId })
      .execute();

    // delete all users with project id
    await getRepository(InboxLogUserEntity)
      .createQueryBuilder()
      .delete()
      .where('projectId = :projectId', { projectId })
      .execute();

    return getRepository(ProjectEntity).remove(project);
  }
}
