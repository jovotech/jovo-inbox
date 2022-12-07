import { IsString } from 'class-validator';

export class SearchUserDto {
  @IsString()
  appId!: string;

  @IsString()
  query!: string;
}
