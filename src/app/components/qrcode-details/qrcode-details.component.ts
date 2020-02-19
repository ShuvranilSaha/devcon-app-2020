import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-qrcode-details',
  templateUrl: './qrcode-details.component.html',
  styleUrls: ['./qrcode-details.component.scss'],
})
export class QrcodeDetailsComponent implements OnInit {

  sessionId = '';
  incorrectSessionId = false;
  qrImageUrl: string;
  qrCode: string;
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.qrImageUrl = this.navParams.get('qrImageUrl');
    this.qrCode = this.navParams.get('qrCode');
   }

  ngOnInit() { }

  async dismissModal() {
    await this.modalCtrl.dismiss();
  }

}
