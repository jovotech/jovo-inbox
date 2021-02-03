import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { InboxLog, InboxLogType } from 'jovo-inbox-core';

@Entity({
  name: 'inboxlog',
})
export class InboxLogEntity implements InboxLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  createdAt: Date = new Date();

  @Column()
  type!: InboxLogType;

  @Index()
  @Column()
  appId!: string;

  @Index()
  @Column()
  userId!: string;

  @Index()
  @Column()
  platform!: string;

  @Index()
  @Column()
  sessionId!: string;

  @Index()
  @Column()
  requestId!: string;

  @Index()
  @Column()
  locale!: string;

  @Column('simple-json')
  // tslint:disable-next-line:no-any
  payload!: any;
}
