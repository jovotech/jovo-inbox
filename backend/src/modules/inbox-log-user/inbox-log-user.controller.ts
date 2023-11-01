import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { InboxLogUserService } from './inbox-log-user.service';
import {
  DeleteUserImageDto,
  GetInboxLogUserDto,
  UpdateInboxLogUserDto,
  UploadedFile,
} from '@jovotech/inbox-core';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('inboxloguser')
export class InboxLogUserController {
  constructor(private readonly service: InboxLogUserService) {}

  @Put()
  updateUser(@Body() updateInboxLogUserDto: UpdateInboxLogUserDto) {
    return this.service.updateUser(updateInboxLogUserDto);
  }

  @Post()
  getUserData(@Body() getInboxLogUser: GetInboxLogUserDto) {
    return this.service.getUser(getInboxLogUser);
  }

  @Post('conversations')
  getUserConversations(
    @Body() getInboxLogUser: Pick<GetInboxLogUserDto, 'id'>,
  ) {
    return this.service.getUserConversations(getInboxLogUser);
  }

  @Get(':projectId')
  getAppUsers(@Param('projectId') projectId: string) {
    return this.service.geProjectUser(projectId);
  }

  @Post('upload-image')
  @UseInterceptors(FilesInterceptor('images'))
  uploadImage(
    @Body() updateInboxLogUserDto: UpdateInboxLogUserDto,
    @UploadedFiles() images: UploadedFile[],
  ) {
    return this.service.uploadImage(updateInboxLogUserDto, images);
  }

  @Delete('/delete-image')
  deleteImage(@Body() deleteUserImageDto: DeleteUserImageDto) {
    return this.service.deleteImage(deleteUserImageDto);
  }
}
