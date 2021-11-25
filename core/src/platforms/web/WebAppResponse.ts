import {JovoInboxPlatformResponse} from '../JovoInboxPlatformResponse';
import type {Action,ActionType} from 'jovo-platform-web'
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

  getOutput(): Out[] {
    const output: Out[] = [];


    this.actions.forEach((action: Action) => {
      if(action.type === 'TEXT') {
        output.push({
          text: action.text,
          type: 'user',
        });
      } else if (action.type === 'SPEECH') {
        output.push({
          text: action.ssml,
          type: 'user',
        });
      }
    });

    return output;
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
    let text = '';

    this.getOutput().forEach((out) =>  {
      text += out.text + '\n\n';
    })

    return text.trim();
  }

  hasSessionEnded(): boolean {
    return false;
  }

  getNluPlain(): string | undefined {
    return this.context?.request?.nlu?.intent?.name;
  }
}
