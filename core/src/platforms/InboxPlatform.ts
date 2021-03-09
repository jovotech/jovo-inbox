import { JovoInboxPlatformRequest } from './JovoInboxPlatformRequest';
import { JovoInboxPlatformResponse } from './JovoInboxPlatformResponse';

export type Constructor<T> = new (...args: unknown[]) => T;

export abstract class InboxPlatform<
  REQUEST extends JovoInboxPlatformRequest = JovoInboxPlatformRequest,
  RESPONSE extends JovoInboxPlatformResponse = JovoInboxPlatformResponse
> {
  abstract readonly name: string;
  abstract readonly requestClass: Constructor<REQUEST>;
  abstract readonly responseClass: Constructor<RESPONSE>;
  abstract readonly image64x64: string;
}
