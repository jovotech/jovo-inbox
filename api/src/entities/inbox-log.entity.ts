import {
  Entity,
  Enum,
  Index,
  JsonType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { InboxLog } from 'jovo-inbox-core';

export enum InboxLogType {
  REQUEST,
  RESPONSE,
  ERROR,
  CUSTOM,
}

@Entity({
  tableName: 'inbox_log',
})
export class InboxLogEntity implements InboxLog {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();

  @Enum()
  type!: InboxLogType;

  @Index()
  @Property()
  appId!: string;

  @Index()
  @Property()
  userId!: string;

  @Index()
  @Property()
  sessionId!: string;

  @Index()
  @Property()
  requestId!: string;

  @Index()
  @Property()
  locale!: string;

  @Property({ type: JsonType, nullable: true })
  payload!: string;
}
