import { ConnectionOptions } from 'typeorm';

export interface InboxConfig {
  apps: AppConfig[];
}

export interface AppConfig {
  name: string;
  id: string;
  connection: Partial<ConnectionOptions>;
}
