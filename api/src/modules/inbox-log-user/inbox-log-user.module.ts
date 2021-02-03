import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import { InboxLogUserEntity } from '../../entity/inbox-log-user.entity';
import { InboxLogUserService } from './inbox-log-user.service';
import { InboxLogUserController } from './inbox-log-user.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([InboxLogEntity, InboxLogUserEntity]),
    MulterModule.register({
      fileFilter(
        req,
        file: {
          fieldname: string;
          originalname: string;
          encoding: string;
          mimetype: string;
          size: number;
          destination: string;
          filename: string;
          path: string;
          buffer: Buffer;
        },
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) {
        const isImage = file.mimetype.startsWith('image/');
        if (!isImage) {
          cb(new Error('Only images can be uploaded.'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [InboxLogUserController],
  providers: [InboxLogUserService],
})
export class InboxLogUserModule {}
