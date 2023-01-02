import path from 'path';

export const LOGS_PER_REQUEST = 150;

export const USER_AVATAR_PATH =
  process.env.NODE_ENV !== 'production'
    ? path.join('/usr/src/app/storage/avatars/')
    : process.env.NODE_ENV +
      '' +
      path.join(__dirname, '../..', 'storage/avatars');
