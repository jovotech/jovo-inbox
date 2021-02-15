import {JovoInboxPlatformRequest, Type} from '../JovoInboxPlatformRequest';
import type {Context, Device, Handler, Home, Intent, Scene, Session, User} from 'jovo-platform-googleassistantconv'

export class ConversationalActionRequest extends JovoInboxPlatformRequest {
  handler?: Handler;
  intent?: Intent;
  scene?: Scene;
  session?: Session;
  user?: User;
  home?: Home;
  device?: Device;
  context?: Context;

  isPlatformRequest(json: any): boolean {
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
    } else if (this.scene?.name.endsWith('_Notifications')) {
      for (const [key, value] of Object.entries(this.scene.slots)) {
        if (key.startsWith('NotificationsSlot_')) {
          if (value.value['@type'] ===
              'type.googleapis.com/google.actions.conversation.v3.PermissionValue') {
            return {
              type: "platform",
              text: 'Notification permission: ' + value.value.permissionStatus
            }
          }
        }
      }
    }

    return {
      type: 'platform',
      text: `Unspecified`,
    };

  }
}
