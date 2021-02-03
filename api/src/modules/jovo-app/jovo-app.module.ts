import { Module } from '@nestjs/common';
import { JovoAppService } from './jovo-app.service';
import { JovoAppController } from './jovo-app.controller';

@Module({
  imports: [],
  controllers: [JovoAppController],
  providers: [JovoAppService],
})
export class JovoAppModule {}
