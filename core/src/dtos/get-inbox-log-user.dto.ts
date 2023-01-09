import { IsOptional, IsString } from 'class-validator';

export class GetInboxLogUserDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  platformUserId?: string;

  @IsString()
  @IsOptional()
  id?: string;
}
