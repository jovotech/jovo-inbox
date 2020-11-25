import type { Plugin, PluginConfig, BaseApp } from 'jovo-framework';
import { HandleRequest } from 'jovo-core';
import { DataEntry } from './interfaces';
import * as AWS from 'aws-sdk';
import { DynamoDbInbox, DynamoDbInboxConfig } from './DynamoDbInbox';
import { AlexaRequest, AlexaSkill } from 'jovo-platform-alexa';
import _merge = require('lodash.merge');

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $inbox?: JovoInbox;
  }
}

export interface JovoInboxConfig extends PluginConfig {
  db?: DynamoDbInboxConfig;
  appId?: string;
}

export class JovoInbox {
  inboxDb: DynamoDbInbox;

  constructor(private config: JovoInboxConfig) {
    this.inboxDb = new DynamoDbInbox(config.db);
  }

  async add(dataEntry: DataEntry) {
    await this.inboxDb.add(dataEntry);
  }
}

export class JovoInboxPlugin implements Plugin {
  config: JovoInboxConfig = {
    enabled: true,
  };
  constructor(config: JovoInboxConfig) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(app: BaseApp): void {
    app.middleware('platform.init')!.use(async (handleRequest: HandleRequest) => {
      handleRequest.jovo!.$inbox = new JovoInbox(this.config);

      const alexaSkill = (handleRequest.jovo as AlexaSkill)!;

      await handleRequest.jovo!.$inbox.add({
        appId: this.config.appId!,
        userId: handleRequest.jovo?.$user.getId()!,
        sessionId: alexaSkill.$request!.getSessionId() || 'no-session',
        requestId: (alexaSkill.$request as AlexaRequest).getRequestId(),
        locale: alexaSkill.$request?.getLocale() || 'en',
        timestamp: new Date().toISOString(),
        type: 'request',
        payload: alexaSkill.$request,
      });
    });

    app.middleware('response')!.use(async (handleRequest: HandleRequest) => {
      if (!handleRequest.jovo!.$inbox) {
        return;
      }
      const alexaSkill = (handleRequest.jovo as AlexaSkill)!;

      await handleRequest.jovo!.$inbox.add({
        appId: this.config.appId!,
        userId: handleRequest.jovo?.$user.getId()!,
        sessionId: alexaSkill.$request!.getSessionId() || 'no-session',
        requestId: (alexaSkill.$request as AlexaRequest).getRequestId(),
        locale: alexaSkill.$request?.getLocale() || 'en',
        timestamp: new Date().toISOString(),
        type: 'response',
        payload: alexaSkill.$response,
      });
    });
  }
}
