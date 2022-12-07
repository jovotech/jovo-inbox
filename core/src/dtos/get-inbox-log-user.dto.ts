import { IsOptional, IsString } from 'class-validator';

export class GetInboxLogUserDto {
  @IsString()
  @IsOptional()
  appId?: string;

  @IsString()
  @IsOptional()
  platformUserId?: string;

  @IsString()
  @IsOptional()
  id?: string;
}
