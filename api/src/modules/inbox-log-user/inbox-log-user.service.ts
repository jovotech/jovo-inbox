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
import { USER_AVATAR_PATH } from '../../constants';

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
    } else if (dto.projectId && dto.platformUserId) {
      cond.where = {
        projectId: dto.projectId,
        platformUserId: dto.platformUserId,
      };
    }

    let user = await getRepository(InboxLogUserEntity).findOne(cond);

    if (!user) {
      user = new InboxLogUserEntity();
      user.platformUserId = dto.platformUserId;
      user.projectId = dto.projectId;
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
    } else if (dto.projectId && dto.platformUserId) {
      cond.where = {
        projectId: dto.projectId,
        platformUserId: dto.platformUserId,
      };
    }

    const user = await getRepository(InboxLogUserEntity).findOne(cond);

    if (!user) {
      return {};
    }
    return user;
  }

  async getUserConversations(
    dto: Pick<GetInboxLogUserDto, 'id' | 'projectId'>,
  ) {
    const user = await getRepository(InboxLogUserEntity).findOne({
      id: dto.id,
    });

    if (!user) {
      return [];
    }

    const service = new InboxLogService();

    return service.getUserConversations({
      projectId: user.projectId,
      userId: user.platformUserId,
    });
  }

  async geProjectUser(projectId: string) {
    return await getRepository(InboxLogUserEntity).find({
      where: {
        projectId: projectId,
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
        projectId: updateInboxLogUserDto.projectId,
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

    const filesDirectory = path.join(USER_AVATAR_PATH);

    if (!fs.existsSync(filesDirectory)) {
      fs.mkdirSync(filesDirectory, { recursive: true });
    }

    fs.writeFileSync(path.join(filesDirectory, user.image), image.buffer);
  }

  async deleteImage(deleteUserImageDto: DeleteUserImageDto) {
    const user = await getRepository(InboxLogUserEntity).findOne({
      where: {
        id: deleteUserImageDto.jovoProjectUserId,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    const filePath = path.join(USER_AVATAR_PATH, user.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    user.image = null;
    await getRepository(InboxLogUserEntity).save(user);
  }
}
