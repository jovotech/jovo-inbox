import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

export interface SSMLObject {
  type: string;
}

export interface AudioObject extends SSMLObject {
  src: string;
  filename: string;
}

export interface BreakObject extends SSMLObject {
  time: string;
}

export interface InterpretAsObject extends SSMLObject {
  interpretAs: string;
  text: string;
}

export interface TextObject extends SSMLObject {
  text: string;
}

dayjs.extend(utc);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(timezone);
export class FormatUtil {
  static formatDate(date: string | Date, simple = true) {
    const dateDayJs = dayjs(date);
    if (dateDayJs.isToday()) {
      return dateDayJs.format('h:mm a');
    } else if (dateDayJs.isYesterday()) {
      return 'yesterday,' + dateDayJs.format(' h:mm a');
    } else if (dateDayJs.isBefore(dayjs().subtract(7, 'day'))) {
      return simple ? dateDayJs.format('MMM, DD') : dateDayJs.format('ddd, h:mm a');
    } else if (dateDayJs.isAfter(dayjs().subtract(7, 'day'))) {
      return simple ? dateDayJs.format('ddd') : dateDayJs.format('ddd, h:mm a');
    } else {
      return dateDayJs.format('ddd, MMM, DD h:mm a');
    }
  }

  static getMessageChunks(message: string) {
    message = message.replace('<speak>', '').replace('</speak>', '');
    const regex = /\s*(?<!\S)([^\s<>]+(?:\s+[^\s<>]+)*)(?!\S)\s*/;
    const chunks = message.split(regex).filter(Boolean);

    const objects: Array<SSMLObject> = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      if (!chunk) {
        continue;
      }

      if (chunk.startsWith('<audio')) {
        const srcMatch = chunk.match(/src="([^"]*)"/);
        if (srcMatch && srcMatch.length > 1) {
          const src = srcMatch[1];
          let filename = src.substring(src.lastIndexOf('/') + 1);
          if (filename.length > 35) {
            filename = `${filename.substr(0, 15)}...${filename.substr(-5)}`;
          }
          objects.push({
            type: 'audio',
            src,
            filename,
          } as AudioObject);
        }
      } else if (chunk.startsWith('<break')) {
        const timeMatch = chunk.match(/time="([^"]*)"/);
        if (timeMatch && timeMatch.length > 1) {
          const time = timeMatch[1];
          objects.push({
            type: 'break',
            time,
          } as BreakObject);
        }
      } else if (chunk.startsWith('<say-as')) {
        const interpretAsMatch = chunk.match(/interpret-as="([^"]*)"/);
        if (interpretAsMatch && interpretAsMatch.length > 1) {
          const interpretAs = interpretAsMatch[1];
          const text = chunk.replace(/<[^>]*>/g, '');
          objects.push({
            type: 'interpret-as',
            interpretAs,
            text,
          } as InterpretAsObject);
        }
      } else {
        objects.push({ type: 'text', text: chunk } as TextObject);
      }
    }
    return objects;
  }

  static shortenUserId(userId: string) {
    return userId.substring(0, 10);
  }
}
