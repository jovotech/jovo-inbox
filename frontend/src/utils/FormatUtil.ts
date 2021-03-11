import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import timezone from 'dayjs/plugin/timezone';

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

  // TODO: alexa only
  static shortenUserId(userId: string) {
    return userId.substr(userId.indexOf('account.') + 8, 10);
  }
}
