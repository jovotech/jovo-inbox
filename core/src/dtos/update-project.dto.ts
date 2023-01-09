import { Project } from '../Project';
import { IsString } from 'class-validator';

export class UpdateProjectDto implements Omit<Project, 'createdAt' | 'updatedAt'> {
  @IsString()
  id!: string;

  @IsString()
  name!: string;
}
