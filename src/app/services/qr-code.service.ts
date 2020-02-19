import * as QRCode from 'qrcode';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrCodeServiceImpl {
  generateDataUrl(data: string): Promise<string> {
    return QRCode.toDataURL(data);
  }
}
