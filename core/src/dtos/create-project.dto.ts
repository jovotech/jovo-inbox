import { IsString } from 'class-validator';
import { Project } from '../Project';

export class CreateProjectDto implements Omit<Project, 'createdAt' | 'updatedAt'> {
  @IsString()
  id!: string;

  @IsString()
  name!: string;
}
