import { JovoInboxPlatformResponse } from '../JovoInboxPlatformResponse';
import type {Context, Request, Session, Action, } from 'jovo-platform-web'
import {Out} from "../JovoInboxPlatformRequest";
import type {AsrData, NluData} from "jovo-core";

export class WebAppResponse extends JovoInboxPlatformResponse {
  version!: string;
  actions!: Action[];
  reprompts!: Action[];
  user!: {
    data: Record<string, any>;
  };
  session!: {
    end: boolean;
    data: Record<string, any>;
  };
  context!: {
    request: {
      asr?: AsrData;
      nlu?: NluData;
    };
  };

  isPlatformResponse(json: any) {
    return !!json.version && !!json.actions &&  !!json.context;
  }

  getReprompt(): string | undefined {
    return undefined;
  }

  getRepromptPlain(): string | undefined {
    return undefined;
  }

  getSpeech(): Out {
    if (this.actions?.length > 0) {
      return {
        text: this.actions[0].ssml || this.actions[0].text,
        type: 'user',
      };
    }

    return {
      type: 'platform',
      text: 'Unspecifiead',
    };
  }

  getSpeechPlain(): string | undefined {
    return undefined;
  }

  hasSessionEnded(): boolean {
    return false;
  }
}
