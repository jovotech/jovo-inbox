import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import * as path from 'path';

import {
  DeleteUserImageDto,
  GetInboxLogUserDto,
  UpdateInboxLogUserDto,
} from 'jovo-inbox-core';
import { FindOneOptions, getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InboxLogUserEntity } from '../../entity/inbox-log-user.entity';
import { UploadedFile } from 'jovo-inbox-core';
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
      return {};
    }
    return user;
  }

  async getUserConversations(dto: Pick<GetInboxLogUserDto, 'id' | 'appId'>) {
    const user = await getRepository(InboxLogUserEntity).findOne({
      id: dto.id,
    });

    if (!user) {
      return [];
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

    const filesDirectory = path.join(process.cwd(), 'public', 'images');

    if (!fs.existsSync(filesDirectory)) {
      fs.mkdirSync(filesDirectory, { recursive: true });
    }

    fs.writeFileSync(path.join(filesDirectory, user.image), image.buffer);
  }

  async deleteImage(deleteUserImageDto: DeleteUserImageDto) {
    const user = await getRepository(InboxLogUserEntity).findOne({
      where: {
        id: deleteUserImageDto.jovoAppUserId,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    const filePath = path.join(process.cwd(), 'public', 'images', user.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    user.image = null;
    await getRepository(InboxLogUserEntity).save(user);
  }
}
