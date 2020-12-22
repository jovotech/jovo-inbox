import Identicon, { IdenticonOptions } from 'identicon.js';
import md5Hex from 'md5-hex';

export class DisplayHelper {
  static stringToArrayValue(val: string, arr: any[]): string {
    const hex = md5Hex(val);
    const dec = parseInt(hex, 16);
    return arr[dec % arr.length];
  }

  static toDisplayIcon(id: string, options: IdenticonOptions): string {
    const hex = md5Hex(id);
    const data = new Identicon(hex, options).toString();
    return 'data:image/svg+xml;base64,' + data;
  }

  private static ucfirst(val: string): string {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
}
