import type { Plugin, PluginConfig, BaseApp } from 'jovo-framework';
import { HandleRequest } from 'jovo-core';
import { DataEntry, JovoInboxDb } from './interfaces';
// import { DynamoDbInbox, DynamoDbInboxConfig } from './DynamoDbInbox';
import { AlexaRequest, AlexaSkill } from 'jovo-platform-alexa';
import _merge = require('lodash.merge');
import { InboxLog, InboxLogType } from '../entities/InboxLog';
import { SqlInbox, SqlInboxConfig } from './SqlInbox';

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $inbox?: JovoInbox;
  }
}



export interface JovoInboxConfig extends PluginConfig {
  db?: SqlInboxConfig;
  appId?: string;
}

export class JovoInbox {
  inboxDb: JovoInboxDb;

  constructor(private config: JovoInboxConfig) {
    this.inboxDb = new SqlInbox(config.db);
  }

  async add(inboxLog: InboxLog) {
    await this.inboxDb.add(inboxLog);
  }

  async close() {
    await this.inboxDb.close();
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
    console.log('install');
    app.middleware('platform.init')!.use(async (handleRequest: HandleRequest) => {
      handleRequest.jovo!.$inbox = new JovoInbox(this.config);
      console.log('init');

      const alexaSkill = (handleRequest.jovo as AlexaSkill)!;

      const inboxLog = new InboxLog();
      inboxLog.appId = this.config.appId!;
      inboxLog.createdAt = new Date();
      inboxLog.locale = alexaSkill.$request?.getLocale() || 'en';
      inboxLog.requestId = (alexaSkill.$request as AlexaRequest).getRequestId();
      inboxLog.sessionId = alexaSkill.$request!.getSessionId() || 'no-session';
      inboxLog.userId = handleRequest.jovo?.$user.getId()!;
      inboxLog.type = InboxLogType.REQUEST;
      inboxLog.payload = alexaSkill.$request;

      await handleRequest.jovo!.$inbox.add(inboxLog);
    });

    app.middleware('response')!.use(async (handleRequest: HandleRequest) => {
      if (!handleRequest.jovo!.$inbox) {
        return;
      }
      const alexaSkill = (handleRequest.jovo as AlexaSkill)!;

      const inboxLog = new InboxLog();
      inboxLog.appId = this.config.appId!;
      inboxLog.createdAt = new Date();
      inboxLog.locale = alexaSkill.$request?.getLocale() || 'en';
      inboxLog.requestId = (alexaSkill.$request as AlexaRequest).getRequestId();
      inboxLog.sessionId = alexaSkill.$request!.getSessionId() || 'no-session';
      inboxLog.userId = handleRequest.jovo?.$user.getId()!;
      inboxLog.type = InboxLogType.RESPONSE;
      inboxLog.payload = alexaSkill.$response;

      await handleRequest.jovo!.$inbox.add(inboxLog);
    });

    app.middleware('fail')!.use(async (handleRequest: HandleRequest) => {
      if (!handleRequest.jovo!.$inbox || !handleRequest.error) {
        return;
      }
      const alexaSkill = (handleRequest.jovo as AlexaSkill)!;

      const payload = {
        message: handleRequest.error.message,
        stackTrace: handleRequest.error.stack,
      };

      const inboxLog = new InboxLog();
      inboxLog.appId = this.config.appId!;
      inboxLog.createdAt = new Date();
      inboxLog.locale = alexaSkill.$request?.getLocale() || 'en';
      inboxLog.requestId = (alexaSkill.$request as AlexaRequest).getRequestId();
      inboxLog.sessionId = alexaSkill.$request!.getSessionId() || 'no-session';
      inboxLog.userId = handleRequest.jovo?.$user.getId()!;
      inboxLog.type = InboxLogType.ERROR;
      inboxLog.payload = payload;

      await handleRequest.jovo!.$inbox.add(inboxLog);
      await handleRequest.jovo!.$inbox.close();
    });

    app.middleware('after.response')!.use(async (handleRequest: HandleRequest) => {
      await handleRequest.jovo!.$inbox!.close();
    });
  }
}
