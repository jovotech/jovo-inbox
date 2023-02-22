import { IsString } from 'class-validator';
import { InboxLog, InboxLogType } from '../InboxLog';

export class AddInboxLogDto implements Omit<InboxLog, 'id' | 'createdAt'> {
  @IsString()
  type!: InboxLogType;

  @IsString()
  projectId!: string;

  @IsString()
  userId!: string;

  @IsString()
  requestId!: string;

  @IsString()
  sessionId!: string;

  @IsString()
  platform!: string;

  @IsString()
  locale!: string;

  payload: any;
}
