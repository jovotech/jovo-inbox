import path from 'path';

export const LOGS_PER_REQUEST = 150;

// TODO: check for different OS and environments
export const USER_AVATAR_PATH =
  process.env.NODE_ENV === 'production'
    ? path.join('/usr/src/app/storage/avatars/')
    : path.join(__dirname, '../..', 'storage/avatars');
