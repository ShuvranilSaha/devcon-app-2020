import {Component, OnInit} from '@angular/core';
import {PreferenceKeys} from '../../config/preference-keys';
import {QrCodeServiceImpl} from '../services/qr-code.service';
import {StallServiceImpl} from '../services/stall/stall-service-impl';
import { SessionPopupComponent } from '../components/session-popup/session-popup.component';
import { PopoverController } from '@ionic/angular';

interface Stall {
  code: string;
  osCreatedAt: string;
  type: string;
  name: string;
  osid: string;
  ideas?: Idea[];
}

interface Idea {
  code: string;
  osCreatedAt: string;
  '@type': string;
  name: string;
  description: string;
  osid: string;
  stallCode: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private stallList: Stall[] = [];

  qrcodeDataURL?: string;
  public readonly profilePicURL = localStorage.getItem(PreferenceKeys.ProfileAttributes.URL_ATTRIBUTE)!;
  public readonly profileName = localStorage.getItem(PreferenceKeys.ProfileAttributes.NAME_ATTRIBUTE)!;

  constructor(
    private qrcodeService: QrCodeServiceImpl,
    private stallService: StallServiceImpl,
    private popCtrl: PopoverController
  ) {
  }

  async ngOnInit() {
    this.qrcodeDataURL = await this.qrcodeService.generateDataUrl(
      localStorage.getItem(PreferenceKeys.ProfileAttributes.QR_CODE_DATA_ATTRIBUTE)!
    );

    this.stallList = await this.stallService.getStallList();
    console.log('stallList', this.stallList);
  }

  async openSessionPopup(stallName: string) {
    if (stallName !== 'School') {
      return;
    }
    const options = {
      component: SessionPopupComponent,
      componentProps: {},
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'popup-w100'
    };
    const sessionPopup = await this.popCtrl.create(options);
    await sessionPopup.present();
  }

}
