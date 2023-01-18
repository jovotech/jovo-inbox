import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import timezone from 'dayjs/plugin/timezone';
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
import utc from 'dayjs/plugin/utc';
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

  // TODO: not XSS safe!!!
  static formatMessage(message: string) {
    message = message.replace('<speak>', '').replace('</speak>', '');

    message = message.replace(/<iframe/gi, '').replace(/<\/iframe/gi, '');
    message = message.replace(/<script>/gi, '').replace(/<\/script>/gi, '');
    message = message.replace(/<s>/gi, '').replace(/<\/s>/gi, '');
    message = message.replace(/<applet>/gi, '').replace(/<\/applet>/gi, '');
    message = message.replace(/<style>/gi, '').replace(/<\/style>/gi, '');
    message = message.replace(/<link>/gi, '').replace(/<\/link>/gi, '');
    message = message.replace(/<embed>/gi, '').replace(/<\/embed>/gi, '');
    message = message.replace(
      /<sub alias=(?:'|")(\S+?)(?:'|")>(.+?)<\/sub>/gi,
      '<span class=" p-1  rounded-lg" title="<sub alias=q$1>$2</sub>">$2</span>',
    );

    message = message.replace(
      /<break time=(?:'|")(\S+?)(?:'|")\/>/gi,
      '<span class="tag-break">(Break $1)</span>',
    );

    const replacer = (x: any, a: string, b: any) => {
      let filename = a.substring(a.lastIndexOf('/') + 1);
      if (filename.length > 35) {
        filename = `${filename.substr(0, 15)}...${filename.substr(-5)}`;
      }
      return `<span class="tag-audio pr-1 py-1 inline-block rounded-lg" title="${a}"><audio class="audio-player" src="${a}"></audio></span><span title="${a}" class="bg-gray-100 text-gray-400 text-sm p-1 rounded -ml-1 rounded-l-none">${filename}</span>`;
    };
    message = message.replace(/<audio src=(?:'|")(.+?)(?:'|")(?:(\/>)|(><\/audio>))/gi, replacer);
    return message;
  }

  static formatMessageSimple(message: string) {
    message = message.replace('<speak>', '').replace('</speak>', '');
    message = message.replace(/<p>/gi, '').replace(/<\/p>/gi, '');

    message = message.replace(/<iframe/gi, '').replace(/<\/iframe/gi, '');
    message = message.replace(/<script>/gi, '').replace(/<\/script>/gi, '');
    message = message.replace(/<s>/gi, '').replace(/<\/s>/gi, '');
    message = message.replace(/<applet>/gi, '').replace(/<\/applet>/gi, '');
    message = message.replace(/<style>/gi, '').replace(/<\/style>/gi, '');
    message = message.replace(/<link>/gi, '').replace(/<\/link>/gi, '');
    message = message.replace(/<embed>/gi, '').replace(/<\/embed>/gi, '');
    const replacer = (x: any, a: string, b: any) => {
      const filename = a.substring(a.lastIndexOf('/') + 1);
      return `${filename} `;
    };
    message = message.replace(/<audio src=(?:'|")(.+?)(?:'|")(?:(\/>)|(><\/audio>))/gi, replacer);
    return message;
  }

  static shortenUserId(userId: string) {
    return userId.substring(0, 10);
  }
}
