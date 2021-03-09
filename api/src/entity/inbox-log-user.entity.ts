import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { InboxLog, InboxLogType } from 'jovo-inbox-core';
import { InboxLogUser } from 'jovo-inbox-core/dist/InboxLogUser';

@Entity({
  name: 'inboxlogusers',
})
export class InboxLogUserEntity implements InboxLogUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();

  @Index()
  @Column()
  platformUserId!: string;

  @Index()
  @Column()
  appId!: string;

  @Index()
  @Column({ nullable: true })
  name!: string | null;

  @Column({ nullable: true })
  notes!: string | null;

  @Column({ nullable: true })
  image!: string | null;
}
