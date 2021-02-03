export interface InboxLogUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  platformUserId: string;
  appId: string;
  name: string;
  notes?: string;
  image?: string;
}
