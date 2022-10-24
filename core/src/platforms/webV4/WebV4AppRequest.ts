import { JovoInboxPlatformRequest, Type } from '../JovoInboxPlatformRequest';
// import type { CoreRequestContext } from '@jovotech/platform-web';
// import type { Input, UnknownObject } from '@jovotech/framework';

export class WebV4AppRequest extends JovoInboxPlatformRequest {
  version!: string;
  id?: string; // UUID v4
  timestamp?: string; // Always in local time, ISO 8601 YYYY-MM-DDTHH:mm:ss.sssZ
  locale?: string; // e.g. de-DE, en-US
  data?: any; // this.$request
  input?: any;
  context?: any;


  isPlatformRequest(json: any): boolean {
      return json.platform === 'web';
  }

  getDeviceName(): string {
    let device = 'Browser';

    return device;
  }

  getPlainText(): string {
    return this.getText().text;
  }

  hasAudioInterface(): boolean {
    return true;
  }

  hasScreenInterface(): boolean {
    return true;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  getText(): { type: Type; text: string } {

    if (this.input?.type === "LAUNCH") {
      return {
        type: 'user',
        text: `LAUNCH`,
      };
    } else  if (this.input?.type === "TEXT") {
      return {
        type: 'user',
        text: this.input.text || '',
      };
    }

    return {
      type: 'platform',
      text: `Unspecified`,
    };
  }

  getNluPlain(): string | undefined {
    return;
  }
}
