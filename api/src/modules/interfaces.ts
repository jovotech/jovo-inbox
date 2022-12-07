export interface InboxConfig {
  apps: AppConfig[];
}

export interface AppConfig {
  name: string;
  id: string;
}

export interface ExportInboxLog {
  userId: string;
  userSaid: string;
  botSaid: string;
  intent: string;
  timestamp: string;
}
