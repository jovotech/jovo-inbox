import { Out } from './JovoInboxPlatformRequest';

export abstract class JovoInboxPlatformResponse {
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

    message = message.replace(
      /<audio src=(?:'|")(.+?)(?:'|") \/>/g,
      '<span class="tag-audio p-1 rounded-lg" title="$1"><audio class="audio-player" src="$1"></audio></span>',
    );
    return message;
  }
}
