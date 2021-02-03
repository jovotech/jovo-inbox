import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { InboxLogUserService } from './inbox-log-user.service';
import { GetInboxLogUserDto, UpdateInboxLogUserDto } from 'jovo-inbox-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from 'jovo-inbox-core/dist/UploadedFile';

@Controller('inboxloguser')
export class InboxLogUserController {
  constructor(private readonly service: InboxLogUserService) {}

  @Put()
  updateUser(@Body() updateInboxLogUserDto: UpdateInboxLogUserDto): any {
    return this.service.updateUser(updateInboxLogUserDto);
  }

  @Post()
  getUserData(@Body() getInboxLogUser: GetInboxLogUserDto) {
    return this.service.getUser(getInboxLogUser);
  }

  @Get(':appId')
  getAppUsers(@Param('appId') appId: string) {
    return this.service.geAppUser(appId);
  }

  @Post('upload-image')
  @UseInterceptors(FilesInterceptor('images'))
  uploadImage(
    @Body() updateInboxLogUserDto: UpdateInboxLogUserDto,
    @UploadedFiles() images: UploadedFile[],
  ) {
    return this.service.uploadImage(updateInboxLogUserDto, images);
  }

  @Delete('/:jovoAppUserId/delete-image')
  deleteImage(@Param('jovoAppUserId') jovoAppUserId: string) {
    return this.service.deleteImage(jovoAppUserId);
  }
}
