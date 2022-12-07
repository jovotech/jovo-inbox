import { IsString } from 'class-validator';

export class DeleteUserImageDto {
  @IsString()
  appId!: string;

  @IsString()
  jovoAppUserId!: string;
}
