import { Controller, Get } from '@nestjs/common';
import { JovoAppList } from 'jovo-inbox-core';
import { JovoAppService } from './jovo-app.service';

import config from './../../inbox.config';

@Controller('jovo-app')
export class JovoAppController {
  constructor(private readonly inboxLogService: JovoAppService) {}

  @Get()
  getJovoApps(): JovoAppList {
    return {
      apps: config.apps.map((app: any) => {
        return {
          name: app.name,
          id: app.id,
        };
      }),
    };
  }
}
