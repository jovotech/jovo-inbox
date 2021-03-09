import { JovoInboxPlatformRequest, Type } from '../JovoInboxPlatformRequest';
import _get from 'lodash.get';

export class GoogleActionRequest extends JovoInboxPlatformRequest {
  responseId?: string;
  queryResult?: any;
  originalDetectIntentRequest?: any;
  session?: string;

  isPlatformRequest(json: any): boolean {
    return !!json.queryResult && json.originalDetectIntentRequest?.source === 'google';
  }

  getDeviceName(): string {
    if (this.hasScreenInterface()) {
      if (this.hasWebBrowserInterface()) {
        return 'Phone';
      } else {
        return 'Smart Display';
      }
    } else {
      return 'Speaker';
    }
  }

  getPlainText(): string {
    return '';
  }

  hasAudioInterface(): boolean {
    return !!_get(this, 'surface.capabilities').find(
      (item: { name: string }) => item.name === 'actions.capability.MEDIA_RESPONSE_AUDIO',
    );
  }

  hasScreenInterface(): boolean {
    return !!_get(this, 'surface.capabilities').find(
      (item: { name: string }) => item.name === 'actions.capability.SCREEN_OUTPUT',
    );
  }

  hasVideoInterface(): boolean {
    return false;
  }

  hasWebBrowserInterface(): boolean {
    return !!_get(this, 'surface.capabilities').find(
      (item: { name: string }) => item.name === 'actions.capability.WEB_BROWSER',
    );
  }

  getText(): { type: Type; text: string } {
    if (this.queryResult?.queryText) {
      return {
        type: 'user',
        text: this.queryResult?.queryText,
      };
    }

    return {
      type: 'platform',
      text: `Unspecified`,
    };
  }
}
