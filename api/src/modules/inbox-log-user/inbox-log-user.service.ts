import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MikroORM, QueryOrder } from '@mikro-orm/core';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import * as path from 'path';

import { GetInboxLogUserDto, UpdateInboxLogUserDto } from 'jovo-inbox-core';
import {
  EntityManager,
  FindOneOptions,
  getRepository,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InboxLogUserEntity } from '../../entity/inbox-log-user.entity';
import { UploadedFile } from 'jovo-inbox-core/dist/UploadedFile';
import * as fs from 'fs';
import { InboxLogService } from '../inbox-log/inbox-log.service';

@Injectable()
export class InboxLogUserService {
  constructor(
    @InjectRepository(InboxLogEntity)
    private inboxLogRepository: Repository<InboxLogEntity>,
  ) {}

  async updateUser(dto: UpdateInboxLogUserDto) {
    const cond: FindOneOptions<InboxLogUserEntity> = {
      where: {},
    };

    if (dto.id) {
      cond.where = {
        id: dto.id,
      };
    } else if (dto.appId && dto.platformUserId) {
      cond.where = {
        appId: dto.appId,
        platformUserId: dto.platformUserId,
      };
    }

    let user = await getRepository(InboxLogUserEntity).findOne(cond);

    if (!user) {
      user = new InboxLogUserEntity();
      user.platformUserId = dto.platformUserId;
      user.appId = dto.appId;
    }
    user.name = dto.name;
    user.notes = dto.notes;

    await getRepository(InboxLogUserEntity).save(user);
    return user;
  }

  async getUser(dto: GetInboxLogUserDto) {
    const cond: FindOneOptions<InboxLogUserEntity> = {
      where: {},
    };

    if (dto.id) {
      cond.where = {
        id: dto.id,
      };
    } else if (dto.appId && dto.platformUserId) {
      cond.where = {
        appId: dto.appId,
        platformUserId: dto.platformUserId,
      };
    }

    const user = await getRepository(InboxLogUserEntity).findOne(cond);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserConversations(dto: Pick<GetInboxLogUserDto, 'id'>) {
    const user = await getRepository(InboxLogUserEntity).findOne({
      id: dto.id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const service = new InboxLogService();

    return service.getUserConversations({
      appId: user.appId,
      userId: user.platformUserId,
    });
  }

  async geAppUser(appId: string) {
    return await getRepository(InboxLogUserEntity).find({
      where: {
        appId: appId,
      },
    });
  }

  async uploadImage(
    updateInboxLogUserDto: UpdateInboxLogUserDto,
    images: UploadedFile[],
  ) {
    if (images.length === 0) {
      throw new BadRequestException();
    }

    let user = await getRepository(InboxLogUserEntity).findOne({
      where: {
        appId: updateInboxLogUserDto.appId,
        platformUserId: updateInboxLogUserDto.platformUserId,
      },
    });

    if (!user) {
      user = await this.updateUser(updateInboxLogUserDto);
    }
    const image = images[0];

    user.image =
      user.id + image.originalname.substr(image.originalname.indexOf('.'));

    await getRepository(InboxLogUserEntity).save(user);

    // TODO: better error mgmt
    const filePath = path.join(
      __dirname,
      './../../../../public/images',
      user.image,
    );
    console.log(filePath);
    fs.writeFileSync(filePath, image.buffer);
  }

  async deleteImage(jovoAppUserId: string) {
    const user = await getRepository(InboxLogUserEntity).findOne({
      where: {
        id: jovoAppUserId,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    const filePath = path.join(
      __dirname,
      './../../../../public/images',
      user.image,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    user.image = null;
    await getRepository(InboxLogUserEntity).save(user);
  }
}
