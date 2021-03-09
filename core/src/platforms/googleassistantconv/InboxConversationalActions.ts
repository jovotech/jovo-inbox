import { ConversationalActionRequest } from './ConversationalActionRequest';
import { ConversationalActionResponse } from './ConversationalActionResponse';
import { InboxPlatform } from '../InboxPlatform';

export class InboxConversationalActions extends InboxPlatform<
  ConversationalActionRequest,
  ConversationalActionResponse
> {
  name = 'GoogleAssistant';
  requestClass = ConversationalActionRequest;
  responseClass = ConversationalActionResponse;
  image64x64 =
    'data:image/png;base64,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';
}
