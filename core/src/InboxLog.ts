import { EnumLike } from '@jovotech/common';

export enum InboxLogType {
  Request = 'request',
  Response = 'response',
  Asr = 'asr',
  Input = 'input',
  Output = 'output',
  Nlu = 'nlu',
  Error = 'error',
  User = 'user',
}

export type InboxLogTypeLike = EnumLike<InboxLogType>;
export interface InboxLog {
  id: number;
  createdAt: Date;
  type: InboxLogTypeLike;
  appId: string;
  platform: string;
  userId: string;
  requestId: string;
  sessionId: string;
  locale: string;
  payload: any;
}

export interface Interaction {
  requestId: string;
  start: Date;
  logs: InboxLog[];
  hasSessionStarted: boolean;
}

export interface Session {
  sessionId: string;
  sessionStart: Date;
  interactions: Interaction[];
}
