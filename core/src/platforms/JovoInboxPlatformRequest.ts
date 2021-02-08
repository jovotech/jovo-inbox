export type Type = 'user' | 'platform';
export interface Out {
  type: Type;
  text: string;
}

export abstract class JovoInboxPlatformRequest {
  abstract getDeviceName(): string;
  abstract hasAudioInterface(): boolean;
  abstract hasScreenInterface(): boolean;
  abstract hasVideoInterface(): boolean;
  abstract getPlainText(): string;
  abstract getText(): Out;
}
