import { IsOptional, IsString } from 'class-validator';

export class GetLastConversationsDto {
  @IsString()
  projectId!: string;

  @IsOptional()
  last?: Date;

  @IsOptional()
  search?: string;

  @IsOptional()
  withErrors?: boolean;

  @IsOptional()
  platform?: string;
}
