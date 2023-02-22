import { IsString } from 'class-validator';

export class SearchUserDto {
  @IsString()
  projectId!: string;

  @IsString()
  query!: string;
}
