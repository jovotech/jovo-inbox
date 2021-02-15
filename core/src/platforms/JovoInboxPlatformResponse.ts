import { Out } from './JovoInboxPlatformRequest';

export abstract class JovoInboxPlatformResponse {
  abstract isPlatformResponse(json: any): boolean;
  abstract getSpeech(): Out;
  abstract getReprompt(): string | undefined;
  abstract getSpeechPlain(): string | undefined;
  abstract getRepromptPlain(): string | undefined;

  formatMessage(message: string) {
    message = message.replace('<speak>', '').replace('</speak>', '');

    message = message.replace(/<iframe/g, '').replace(/<\/iframe/g, '');
    message = message.replace(/<script>/g, '').replace(/<\/script>/g, '');
    message = message.replace(/<s>/g, '').replace(/<\/s>/g, '');
    message = message.replace(/<applet>/g, '').replace(/<\/applet>/g, '');
    message = message.replace(/<style>/g, '').replace(/<\/style>/g, '');
    message = message.replace(/<link>/g, '').replace(/<\/link>/g, '');
    message = message.replace(/<embed>/g, '').replace(/<\/embed>/g, '');
    message = message.replace(
      /<sub alias=(?:'|")(\S+?)(?:'|")>(.+?)<\/sub>/g,
      '<span class=" p-1  rounded-lg" title="<sub alias=q$1>$2</sub>">$2</span>',
    );

    message = message.replace(
      /<break time=(?:'|")(\S+?)(?:'|")\/>/g,
      '<span class="tag-break">(Break $1)</span>',
    );

    const foobar = (str: string) => {
      return 'foobar';
    };

    // message = message.replace(
    //   /<audio src=(?:'|")(.+?)(?:'|")(?:(\/>)|(><\/audio>))/g,
    //   '<span class="tag-audio pr-1 py-1 inline-block rounded-lg" title="$1"><audio class="audio-player" src="$1"></audio></span>',
    // );

    const replacer = (x: any, a: string, b: any) => {
      const filename = a.substring(a.lastIndexOf('/') + 1);
      return `<span class="tag-audio pr-1 py-1 inline-block rounded-lg" title="${a}"><audio class="audio-player" src="${a}"></audio></span><span class="bg-gray-100 text-gray-400 text-sm p-1 rounded -ml-1 rounded-l-none">${filename}</span>`;
    };
    message = message.replace(/<audio src=(?:'|")(.+?)(?:'|")(?:(\/>)|(><\/audio>))/gi, replacer);
    return message;
  }
}
