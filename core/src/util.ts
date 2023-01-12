import { InboxLog, PLATFORMS } from './index';
import { OutputTemplate, OutputTemplateConverter } from '@jovotech/framework';

export const getRequestPlatform = (inboxLog: InboxLog) => {
  return PLATFORMS.find((platform) =>
    Array.isArray(inboxLog.payload)
      ? inboxLog.payload.every((req) => platform.isRequestRelated(req))
      : platform.isRequestRelated(inboxLog.payload),
  );
};

export const getPlatformRequest = (inboxLog: InboxLog) => {
  const platform = getRequestPlatform(inboxLog);

  if (platform) {
    const platformRequest = platform.createRequestInstance(inboxLog.payload);

    const requestIntent = platformRequest.getIntent();
    const requestIntentName =
      typeof requestIntent === 'string' ? requestIntent : requestIntent?.name;
    const text =
      platformRequest.getInputText() ||
      requestIntentName ||
      (platformRequest.getInputType() as string | undefined) ||
      '<Unknown>';

    return {
      type: 'user',
      text: text,
    };
  }
};

export const getResponsePlatform = (inboxLog: InboxLog) => {
  return PLATFORMS.find((platform) =>
    Array.isArray(inboxLog.payload)
      ? inboxLog.payload.every((res) => platform.isResponseRelated(res))
      : platform.isResponseRelated(inboxLog.payload),
  );
};

export const getPlatformResponseOutputTemplate = async (
  inboxLog: InboxLog,
): Promise<OutputTemplate[]> => {
  const platform = getResponsePlatform(inboxLog);
  if (platform) {
    const outputTemplateConverter = new OutputTemplateConverter(
      platform.outputTemplateConverterStrategy,
    );
    const output = await outputTemplateConverter.fromResponse(inboxLog.payload);

    if (Array.isArray(output)) {
      return output;
    }
    return [output];
  }

  return [];
};

export const getOutputText = (output: OutputTemplate): string => {
  if (typeof output.message === 'string') {
    return output.message;
  }

  if (Array.isArray(output.message)) {
    return output.message.join(' ');
  }

  return output.message?.text || removeSSML(output.message!.speech || '');
};

export const removeSSML = (ssml: string): string => {
  return ssml.replace(/<[^>]*>/g, '');
};
