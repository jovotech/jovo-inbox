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

export interface SSMLObject {
  type: string;
}

export interface AudioObject extends SSMLObject {
  src: string;
  filename: string;
}

export interface BreakObject extends SSMLObject {
  time: string;
}

export interface InterpretAsObject extends SSMLObject {
  interpretAs: string;
  text: string;
}

export interface TextObject extends SSMLObject {
  text: string;
}
