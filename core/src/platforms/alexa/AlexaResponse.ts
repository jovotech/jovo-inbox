import { JovoInboxPlatformResponse } from '../JovoInboxPlatformResponse';
import type {Context, Request, Session, SessionAttributes} from 'jovo-platform-alexa'
import {Out} from "../JovoInboxPlatformRequest";
import {Directive} from "jovo-platform-alexa/dist/src/core/AlexaResponse";

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

  getOutput(): Out[] {
    const out: Out[] = [];

    if (this.response?.outputSpeech?.ssml) {
      out.push({
        text: this.response?.outputSpeech?.ssml,
        type: 'user',
      });
    }
    for (let i = 0; i < this.response?.directives?.length; i++) {
        const directive = this.response.directives[i];

        if (directive.type === 'Alexa.Presentation.APLA.RenderDocument') {
          const result = apla(directive.document.mainTemplate, '');
          out.push({
            text: result,
            type: 'user',
          });
        }


        // switch (directive.name) {
        //   case 'AskFor': {
        //     const scope = directive.payload.permissionScope.includes('reminders')
        //         ? 'Reminders'
        //         : directive.payload.permissionScope;
        //     out.push({
        //       type: 'platform',
        //       text: `AskFor ${scope}`,
        //     });
        //   }
        // }
    }



    return out;
  }

  getSpeech(): Out {
    console.log(this.response?.directives?.length)
    if (false && this.response?.outputSpeech?.ssml) {
      return {
        text: this.response?.outputSpeech?.ssml,
        type: 'user',
      };
    } else if (this.response?.directives?.length > 0) {
      const aplaDirectives = this.response?.directives.filter((item: Directive) => item.type === 'Alexa.Presentation.APLA.RenderDocument')

      if (aplaDirectives) {
        const text = '';
        const result = apla(aplaDirectives[0].document.mainTemplate, text);
        console.log(result)
      }


      // for (let i = 0; i < this.response.directives.length; i++) {
      //   const directive = this.response.directives[i];
      //   switch (directive.name) {
      //     case 'AskFor': {
      //       const scope = directive.payload.permissionScope.includes('reminders')
      //           ? 'Reminders'
      //           : directive.payload.permissionScope;
      //       return {
      //         type: 'platform',
      //         text: `AskFor ${scope}`,
      //       };
      //     }
      //   }
      // }
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


// TODO: temporary
function apla(data: any, result: string): string {

  if (data.items) {
    for (let i = 0; i < data.items.length; i++) {
        result = apla(data.items[i], result)
    }
  } else {
    if (data.type === 'Speech') {
      result += data.content;
    } else if (data.type === 'Audio') {
      result += `<a src="${data.source}" />`;
    }
  }
  return result;
}