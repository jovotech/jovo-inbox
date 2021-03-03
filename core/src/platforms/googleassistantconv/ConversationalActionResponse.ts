import { JovoInboxPlatformResponse } from '../JovoInboxPlatformResponse';
import {Out} from "../JovoInboxPlatformRequest";
import type {Device, Expected, Home, Prompt, Scene, User, Session} from "jovo-platform-googleassistantconv";

export class ConversationalActionResponse extends JovoInboxPlatformResponse {
  prompt?: Prompt;
  scene?: Scene;
  session?: Session;
  user?: User;
  home?: Home;
  device?: Device;
  expected?: Expected;

  isPlatformResponse(json: any) {
    return !!json.user  && !!json.prompt;
  }

  getReprompt(): string | undefined {
    return undefined;
  }

  getRepromptPlain(): string | undefined {
    return undefined;
  }

  getOutput(): Out[] {
    const output: Out[] = [];

    if (this.prompt?.firstSimple) {
      output.push({
        type: 'user',
        text: this.prompt?.firstSimple.speech || this.prompt?.firstSimple.text || '',
      })
    }
    if (this.prompt?.lastSimple) {
      output.push({
        type: 'user',
        text: this.prompt?.lastSimple.speech || this.prompt?.lastSimple.text || '',
      })
    }
    return output;
  }

  getSpeech(): Out {

    const firstSimple =  this.prompt?.firstSimple?.speech;

    return {
      type: 'user',
      text: firstSimple!,
    };
  }

  getSpeechPlain(): string | undefined {
    return undefined;
  }

  hasSessionEnded(): boolean {
    return this.scene?.next?.name === 'actions.scene.END_CONVERSATION';
  }
}
