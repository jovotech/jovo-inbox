import Identicon, { IdenticonOptions } from 'identicon.js';
import md5Hex from 'md5-hex';

export interface CustomIdenticonOptions extends IdenticonOptions {
  saturation: number;
  brightness: number;
}

export class DisplayHelper {
  static toDisplayIcon(id: string, options: Partial<CustomIdenticonOptions>): string {
    const hex = md5Hex(id);
    const data = new Identicon(hex, options).toString();
    return 'data:image/svg+xml;base64,' + data;
  }

  private static ucfirst(val: string): string {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
}
