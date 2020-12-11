export enum InboxLogType {
  REQUEST,
  RESPONSE,
  ERROR,
  CUSTOM,
}
export interface InboxLog {
  id: number;
  createdAt: Date;
  type: InboxLogType;
  appId: string;
  userId: string;
  requestId: string;
  sessionId: string;
  locale: string;
  payload: any;
}
