import {JovoInboxPlatformRequest, Type} from '../JovoInboxPlatformRequest';
import type {Context, Device, Handler, Home, Intent, Scene, Session, User} from 'jovo-platform-googleassistantconv'
import _get = require('lodash.get');

export class ConversationalActionRequest extends JovoInboxPlatformRequest {
  handler?: Handler;
  intent?: Intent;
  scene?: Scene;
  session?: Session;
  user?: User;
  home?: Home;
  device?: Device;
  context?: Context;

  static isPlatformRequest(json: any): boolean {
    return !!json.handler && !!json.scene && !!json.intent && !!json.user
  }

  getDeviceName(): string {
    let device = 'Google Home';

    return device;
  }

  getPlainText(): string {
    return '';
  }

  hasAudioInterface(): boolean {
    return false;
  }

  hasScreenInterface(): boolean {
    return false;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  getText(): { type: Type; text: string } {
    if (this.intent?.query) {
      return {
        type: "user",
        text: this.intent?.query
      }
    }

    return {
      type: 'platform',
      text: `Unspecified`,
    };

  }
}
