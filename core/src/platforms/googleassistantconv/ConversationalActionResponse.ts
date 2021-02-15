import { JovoInboxPlatformResponse } from '../JovoInboxPlatformResponse';
import type {Context, Request, Session, SessionAttributes} from 'jovo-platform-alexa'
import {Out} from "../JovoInboxPlatformRequest";
import {Device, Expected, Home, Prompt, Scene, User} from "jovo-platform-googleassistantconv";

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

  getSpeech(): Out {

    const firstSimple =  this.prompt?.firstSimple?.speech;

    return {
      type: 'user',
      text: this.formatMessage(firstSimple!),
    };
  }

  getSpeechPlain(): string | undefined {
    return undefined;
  }
}
