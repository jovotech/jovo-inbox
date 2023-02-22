import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SelectUserConversationsDto {
  @IsString()
  projectId!: string;

  @IsString()
  userId!: string;

  @IsString()
  @IsOptional()
  last?: Date;

  @IsNumber()
  @IsOptional()
  lastId?: number;
}
