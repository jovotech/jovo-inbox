import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { InboxLogEntity } from '../../entities/inbox-log.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [InboxLogEntity],
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
