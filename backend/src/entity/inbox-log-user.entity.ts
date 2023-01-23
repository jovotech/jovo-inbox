import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { InboxLogUser } from 'jovo-inbox-core';

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
  projectId!: string;

  @Index()
  @Column({ nullable: true })
  name!: string | null;

  @Column({ nullable: true })
  notes!: string | null;

  @Column({ nullable: true })
  image!: string | null;
}
