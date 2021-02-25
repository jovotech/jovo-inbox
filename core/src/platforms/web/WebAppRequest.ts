import {JovoInboxPlatformRequest, Type} from '../JovoInboxPlatformRequest';
import type {Context, Request, Session} from 'jovo-platform-web'

export class WebAppRequest extends JovoInboxPlatformRequest {
  version!: string;
  type!: string;
  request!: Request;
  context!: Context;

  isPlatformRequest(json: any): boolean {
    return json.type === 'jovo-platform-web';
  }

  getDeviceName(): string {
    let device = 'Browser';

    return device;
  }

  getPlainText(): string {
    return '';
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
    if (this.request?.type === 'LAUNCH') {
      return {
        type: 'user',
        text: `LAUNCH`,
      };
    } else if (this.request?.type === 'TEXT') {
      return {
        type: 'user',
        text: this.request.body.text!,
      };
    }

    return {
      type: 'platform',
      text: `Unspecified`,
    };

  }
}
