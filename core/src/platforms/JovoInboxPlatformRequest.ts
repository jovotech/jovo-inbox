export type Type = 'user' | 'platform';
export interface Out {
  type: Type;
  text: string;
  subtext?: string;
}

export abstract class JovoInboxPlatformRequest {
  abstract isPlatformRequest(json: any): boolean;
  abstract getDeviceName(): string;
  abstract hasAudioInterface(): boolean;
  abstract hasScreenInterface(): boolean;
  abstract hasVideoInterface(): boolean;
  abstract getPlainText(): string;
  abstract getText(): Out;
}
