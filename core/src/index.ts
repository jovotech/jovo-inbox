import { CorePlatform } from '@jovotech/platform-core';
import { Platform } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';
import { WebPlatform } from '@jovotech/platform-web';
import { FacebookMessengerPlatform } from '@jovotech/platform-facebookmessenger';
import { GoogleAssistantPlatform } from '@jovotech/platform-googleassistant';
import { GoogleBusinessPlatform } from '@jovotech/platform-googlebusiness';

export * from './InboxLog';
export * from './InboxLogUser';
export * from './Project';

export * from './JovoAppMetaData';
export * from './dtos/select-user-conversations.dto';
export * from './dtos/update-inbox-log-user.dto';
export * from './dtos/get-inbox-log-user.dto';
export * from './dtos/get-last-conversations.dto';
export * from './dtos/delete-user-image.dto';
export * from './dtos/add-inbox-log.dto';
export * from './dtos/create-project.dto';
export * from './dtos/update-project.dto';

export * from './UserConversationsResponse';
export * from './UploadedFile';
export * from './util';

export const DEBUGGER_PLATFORM_TYPE = 'jovo-debugger';

export const DEBUGGER_PLATFORM = new CorePlatform({
  type: DEBUGGER_PLATFORM_TYPE,
  platform: DEBUGGER_PLATFORM_TYPE,
});

export const PLATFORMS: Platform[] = [
  DEBUGGER_PLATFORM,
  new AlexaPlatform(),
  new CorePlatform(),
  new WebPlatform(),
  new FacebookMessengerPlatform({
    pageAccessToken: '',
  }),
  new GoogleAssistantPlatform(),
  new GoogleBusinessPlatform({
    serviceAccount: {},
  }),
];
