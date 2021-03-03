import { JovoInboxPlatformResponse } from '../JovoInboxPlatformResponse';
import { Out } from '../JovoInboxPlatformRequest';
import type {   SessionEntityType } from 'jovo-platform-dialogflow';
import _get from 'lodash.get';


export class GoogleActionResponse extends JovoInboxPlatformResponse {
  fulfillmentText?: string;
  payload?: any;
  outputContexts?: any[];
  sessionEntityTypes?: SessionEntityType[];

  isPlatformResponse(json: any) {
    return !!json.payload?.google;
  }

  getReprompt(): string | undefined {
    return undefined;
  }

  getRepromptPlain(): string | undefined {
    return undefined;
  }

  getOutput(): Out[] {
    const output: Out[] = [];

    const items = _get(this.payload, 'google.richResponse.items', []);

    items.forEach((item: any) => {
      if (item.simpleResponse) {
        output.push({
          type: 'user',
          text: item.simpleResponse.ssml || item.simpleResponse.text
        });
      }
    })

    return output;
  }

  getSpeech(): Out {
    if (_get(this.payload, 'google.richResponse.items[0].simpleResponse.ssml')) {
      return  {
        type: 'user',
        text: _get(this, 'payload.google.richResponse.items[0].simpleResponse.ssml', '')!
      };
    }

    return {
      type: 'user',
      text: 'error',
    };
  }

  getSpeechPlain(): string | undefined {
    return undefined;
  }

  hasSessionEnded(): boolean {
    return false; //TODO:
  }
}
