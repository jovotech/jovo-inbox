import { Out } from './JovoInboxPlatformRequest';

export abstract class JovoInboxPlatformResponse {
  abstract isPlatformResponse(json: any): boolean;
  abstract getSpeech(): Out;
  abstract getReprompt(): string | undefined;
  abstract getSpeechPlain(): string | undefined;
  abstract getRepromptPlain(): string | undefined;
  abstract hasSessionEnded(): boolean;
}
