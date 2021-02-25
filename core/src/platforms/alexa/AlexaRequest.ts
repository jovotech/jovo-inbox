import {JovoInboxPlatformRequest, Out, Type} from '../JovoInboxPlatformRequest';
import type {Context, Request, Session} from 'jovo-platform-alexa'
import _get from 'lodash.get';

export class AlexaRequest extends JovoInboxPlatformRequest {
  version?: string;
  context?: Context;
  session?: Session;
  request?: Request;

  isPlatformRequest(json: any): boolean {
    return !!json.request && !!json.version && !!json.session;
  }

  getDeviceName(): string {
    let device = 'Echo';

    if (this.context && this.context.Viewport) {
      device =
          'Unknown Device with Screen ' +
          this.context.Viewport.pixelWidth +
          'x' +
          this.context.Viewport.pixelHeight;

      if (
          this.context.Viewport.pixelWidth === 480 &&
          this.context.Viewport.pixelHeight === 480 &&
          this.context.Viewport.dpi === 160 &&
          this.context.Viewport.shape === 'ROUND'
      ) {
        device = 'Echo Spot'; //'Echo Spot';
      }

      if (
          this.context.Viewport.pixelWidth === 960 &&
          this.context.Viewport.pixelHeight === 480 &&
          this.context.Viewport.dpi === 160 &&
          this.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = 'Echo Show 5'; //'Echo Show 5';
      }

      if (
          this.context.Viewport.pixelWidth === 1280 &&
          this.context.Viewport.pixelHeight === 720 &&
          this.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = 'Alexa HD Ready TV';
      }

      if (
          this.context.Viewport.pixelWidth === 1920 &&
          this.context.Viewport.pixelHeight === 1080 &&
          this.context.Viewport.dpi === 320 &&
          this.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = 'Full HD TV'; //'Full HD TV';
      }

      if (
          this.context.Viewport.pixelWidth === 1024 &&
          this.context.Viewport.pixelHeight === 600 &&
          this.context.Viewport.dpi === 160 &&
          this.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = 'Echo Show 1st gen'; //'Echo Show 1st gen';
      }

      if (
          this.context.Viewport.pixelWidth === 1280 &&
          this.context.Viewport.pixelHeight === 800 &&
          this.context.Viewport.dpi === 160 &&
          this.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = 'Echo Show 2nd gen'; //'Echo Show 2nd gen';
      }
    }
    return device;
  }

  getPlainText(): string {
    return '';
  }

  hasAudioInterface(): boolean {
    return (
        this.hasScreenInterface() ||
        typeof _get(this.context?.System.device, 'supportedInterfaces.AudioPlayer') !== 'undefined'
    );
  }

  hasScreenInterface(): boolean {
    return false;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  getText(): Out {
    if (this.request?.type === 'LaunchRequest') {
      return {
        type: 'user',
        text: 'LAUNCH',
      };
    } else if (this.request?.type === 'IntentRequest' && this.request?.intent?.name) {
      return {
        type: 'user',
        text: this.request?.intent?.name,
      };
    } else if (this.request?.type === 'SessionEndedRequest' && this.request.reason === 'ERROR') {
      return {
        type: 'platform',
        text: `ERROR: ${this.request.error?.type}`,
        subtext: `${this.request.error?.message}`
      };
    } else if (this.request?.type === 'SessionEndedRequest') {
      return {
        type: 'user',
        text: `SessionEndedRequest ${this.request.reason || ''}`,
      };
    } else if (this.request?.type === 'Connections.Response') {
      switch (this.request.name) {
        case 'AskFor': {
          // @ts-ignore
          const scope = this.request?.payload?.permissionScope.includes('reminders')
              ? 'Reminders'
              // @ts-ignore
              : this.request.payload.permissionScope;
          // @ts-ignore
          const status = this.request.payload.status.toLowerCase();
          return {
            type: 'platform',
            text: `${scope} ${status}`,
          };
        }
      }
    }

    return {
      type: 'platform',
      text: `Unspecified`,
    };

  }
}
