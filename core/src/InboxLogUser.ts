export interface InboxLogUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  platformUserId: string;
  projectId: string;
  name: string;
  notes?: string;
  image?: string;
}
