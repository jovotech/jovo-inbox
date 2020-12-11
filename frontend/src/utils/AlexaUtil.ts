export enum AlexaDeviceName {
  ALEXA_AUDIO_ONLY = 'AUDIO_ALEXA_AUDIO_ONLY',
  ALEXA_HUB_SMALL_ROUND = 'ALEXA_HUB_SMALL_ROUND',
  ALEXA_HUB_SMALL_RECTANGLE = 'ALEXA_HUB_SMALL_RECTANGLE',
  ALEXA_HUB_MEDIUM_RECTANGLE = 'ALEXA_HUB_MEDIUM_RECTANGLE',
  ALEXA_HUB_LARGE_RECTANGLE = 'ALEXA_HUB_LARGE_RECTANGLE',
  ALEXA_TV_XLARGE_RECTANGLE = 'ALEXA_TV_XLARGE_RECTANGLE',
  ALEXA_UNSPECIFIED = 'ALEXA_UNSPECIFIED',
  ALEXA_UNSPECIFIED_SCREEN = 'ALEXA_UNSPECIFIED_SCREEN',
}

export class AlexaUtil {
  static getDeviceName(request: any): AlexaDeviceName {
    let device: AlexaDeviceName = AlexaDeviceName.ALEXA_AUDIO_ONLY;
    if (request.context && request.context.Viewport) {
      device = AlexaDeviceName.ALEXA_UNSPECIFIED_SCREEN;

      if (
        request.context.Viewport.pixelWidth === 480 &&
        request.context.Viewport.pixelHeight === 480 &&
        request.context.Viewport.dpi === 160 &&
        request.context.Viewport.shape === 'ROUND'
      ) {
        device = AlexaDeviceName.ALEXA_HUB_SMALL_ROUND; //'Echo Spot';
      }

      if (
        request.context.Viewport.pixelWidth === 960 &&
        request.context.Viewport.pixelHeight === 480 &&
        request.context.Viewport.dpi === 160 &&
        request.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = AlexaDeviceName.ALEXA_HUB_SMALL_RECTANGLE; //'Echo Show 5';
      }

      if (
        request.context.Viewport.pixelWidth === 1920 &&
        request.context.Viewport.pixelHeight === 1080 &&
        request.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = AlexaDeviceName.ALEXA_TV_XLARGE_RECTANGLE; //'Full HD TV';
      }

      if (
        request.context.Viewport.pixelWidth === 1024 &&
        request.context.Viewport.pixelHeight === 600 &&
        request.context.Viewport.dpi === 160 &&
        request.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = AlexaDeviceName.ALEXA_HUB_MEDIUM_RECTANGLE; //'Echo Show 1st gen';
      }

      if (
        request.context.Viewport.pixelWidth === 1280 &&
        request.context.Viewport.pixelHeight === 800 &&
        request.context.Viewport.dpi === 160 &&
        request.context.Viewport.shape === 'RECTANGLE'
      ) {
        device = AlexaDeviceName.ALEXA_HUB_LARGE_RECTANGLE; //'Echo Show 2nd gen';
      }
    }
    return device;
  }

  static getFriendlyDeviceName(request: any) {
    const deviceName = AlexaUtil.getDeviceName(request);
    switch (deviceName) {
      case AlexaDeviceName.ALEXA_AUDIO_ONLY:
        return 'Echo';
      case AlexaDeviceName.ALEXA_HUB_SMALL_ROUND:
        return 'Echo Spot';
      case AlexaDeviceName.ALEXA_HUB_SMALL_RECTANGLE:
        return 'Echo Show 5';
      case AlexaDeviceName.ALEXA_HUB_MEDIUM_RECTANGLE:
        return 'Echo Show';
      case AlexaDeviceName.ALEXA_HUB_LARGE_RECTANGLE:
        return 'Echo Show 2';
      case AlexaDeviceName.ALEXA_TV_XLARGE_RECTANGLE:
        return 'TV';
      case AlexaDeviceName.ALEXA_UNSPECIFIED:
        return 'Unspecified';
      case AlexaDeviceName.ALEXA_UNSPECIFIED_SCREEN:
        return 'Unspecfied with screen';
    }
  }

  static hasAplInterface(request: any): boolean {
    return (
      typeof request.context?.System?.device?.supportedInterfaces['Alexa.Presentation.APL'] !==
      'undefined'
    );
  }
}