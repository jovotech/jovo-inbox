import { IsOptional, IsString } from 'class-validator';

export class UpdateInboxLogUserDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  projectId!: string;

  @IsString()
  platformUserId!: string;

  @IsString()
  name?: string;

  @IsString()
  notes?: string;
}
