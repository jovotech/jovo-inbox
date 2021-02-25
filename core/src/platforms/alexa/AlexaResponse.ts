import { JovoInboxPlatformResponse } from '../JovoInboxPlatformResponse';
import type {Context, Request, Session, SessionAttributes} from 'jovo-platform-alexa'
import {Out} from "../JovoInboxPlatformRequest";

export class AlexaResponse extends JovoInboxPlatformResponse {
  version?: string;
  response: any; // TODO temporary, change to Response after release of jovo-platform-alexa@3.4.1
  sessionAttributes?: SessionAttributes;

  isPlatformResponse(json: any) {
    return !!json.version && !!json.response;
  }

  getReprompt(): string | undefined {
    return undefined;
  }

  getRepromptPlain(): string | undefined {
    return undefined;
  }

  getSpeech(): Out {
    if (this.response?.outputSpeech?.ssml) {
      return {
        text: this.response?.outputSpeech?.ssml,
        type: 'user',
      };
    } else if (this.response?.directives) {
      const [directive] = this.response.directives;

      switch (directive.name) {
        case 'AskFor': {
          const scope = directive.payload.permissionScope.includes('reminders')
            ? 'Reminders'
            : directive.payload.permissionScope;
          return {
            type: 'platform',
            text: `AskFor ${scope}`,
          };
        }
      }
    }

    return {
      type: 'platform',
      text: 'Unspecified',
    };
  }

  getSpeechPlain(): string | undefined {
    return undefined;
  }

  hasSessionEnded(): boolean {
    return this.response?.shouldEndSession;
  }
}
