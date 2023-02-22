import { PLATFORM_LOGOS } from '@/constants';

export const getPlatformLogo = (platform: string): string => {
  return PLATFORM_LOGOS[platform] ? PLATFORM_LOGOS[platform] : PLATFORM_LOGOS['FALLBACK'];
};
