import { IsString } from 'class-validator';

export class DeleteUserImageDto {
  @IsString()
  projectId!: string;

  @IsString()
  jovoProjectUserId!: string;
}
