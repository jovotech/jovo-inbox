import { InboxLog } from './InboxLog';

export interface UserConversationsResponse {
  last?: Date;
  logs: InboxLog[];
}
