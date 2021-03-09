import config from './inbox.config';

export const connectionName = (appId: string) => {
  if (config.apps.length > 0 && config.apps[0].id === appId) {
    return 'default';
  }
  return appId;
};
