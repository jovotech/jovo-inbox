import {JovoInboxPlatformResponse} from '../JovoInboxPlatformResponse';
import {Out} from "../JovoInboxPlatformRequest";

export class WebV4AppResponse extends JovoInboxPlatformResponse {

  version!: string;
  output!: any[];

  isPlatformResponse(json: any) {
    return !!json.version && !!json.output &&  !!json.context;
  }

  getReprompt(): string | undefined {
    return undefined;
  }

  getRepromptPlain(): string | undefined {
    return undefined;
  }

  getOutput(): Out[] {
    const output: Out[] = [];

    this.output.forEach((out) => {
      if(out.message) {
        if (typeof out.message === 'string')
          output.push({
            text: out.message,
            type: 'user',
          });
        } else {
            output.push({
                text: out.message.text || out.message.speech,
                type: 'user',
            });
        }
    });


    return output;
  }

  getSpeech(): Out {
    if (this.output.length > 0) {

      if(this.output[0].message) {
        if (typeof this.output[0].message === 'string')
          return{
            text: this.output[0].message,
            type: 'user',
          };
      } else {
        return{
          text: this.output[0].message.speech || this.output[0].message.text,
          type: 'user',
        };
      }


    }

    return {
      type: 'platform',
      text: 'Unspecified',
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
    return ""; //TODO
  }
}
