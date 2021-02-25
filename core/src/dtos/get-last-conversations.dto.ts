export interface GetLastConversationsDto {
  appId: string;
  last?: Date;
  search?: string;
  withErrors?: boolean;
  platform?: string;
}
