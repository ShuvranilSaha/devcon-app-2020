import * as QRCode from 'qrcode';

export interface QrCodeService {
  generateDataUrl(data: string): Promise<string>;
}

export class QrCodeServiceImpl implements QrCodeService {
  generateDataUrl(data: string): Promise<string> {
    return QRCode.toDataURL(data);
  }
}
