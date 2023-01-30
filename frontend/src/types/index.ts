export enum NotificationType {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export type NotificationTypeValues = keyof typeof NotificationType;

export interface NotificationData {
  id?: string | number;
  type: NotificationType | NotificationTypeValues;
  title: string;
  description?: string;
  duration?: number;
}
