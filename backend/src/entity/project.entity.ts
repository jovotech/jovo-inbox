import { Column, Entity, Index } from 'typeorm';
import { Project } from '@jovotech/inbox-core';

@Entity({
  name: 'projects',
})
export class ProjectEntity implements Project {
  @Column({ primary: true })
  id!: string;

  @Index()
  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();

  @Column()
  name!: string;
}
