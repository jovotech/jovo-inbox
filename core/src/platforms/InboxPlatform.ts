import { JovoInboxPlatformRequest } from './JovoInboxPlatformRequest';
import { JovoInboxPlatformResponse } from './JovoInboxPlatformResponse';
import { InboxLog } from '../InboxLog';

export type Constructor<T> = new (...args: unknown[]) => T;

export abstract class InboxPlatform<
  REQUEST extends JovoInboxPlatformRequest = JovoInboxPlatformRequest,
  RESPONSE extends JovoInboxPlatformResponse = JovoInboxPlatformResponse
> {
  abstract readonly name: string;
  abstract readonly requestClass: Constructor<REQUEST>;
  abstract readonly responseClass: Constructor<RESPONSE>;
  abstract readonly image64x64: string;

  static getPlatformRequest(
    inboxLog: InboxLog,
    platforms: InboxPlatform[],
  ): JovoInboxPlatformRequest | undefined {
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      const requestConstructor = platform.requestClass;
      const request = new requestConstructor();
      if (request && request.isPlatformRequest(inboxLog.payload)) {
        return Object.assign(request, inboxLog.payload) as JovoInboxPlatformRequest;
      }
    }
  }
  static getPlatformResponse(
    inboxLog: InboxLog,
    platforms: InboxPlatform[],
  ): JovoInboxPlatformResponse | undefined {
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      const responseConstructor = platform.responseClass;

      const response = new responseConstructor();
      if (response && response.isPlatformResponse(inboxLog.payload)) {
        return Object.assign(response, inboxLog.payload) as JovoInboxPlatformResponse;
      }
    }
  }
}
