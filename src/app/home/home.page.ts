import {Component, OnInit} from '@angular/core';
import {PreferenceKeys} from '../../config/preference-keys';
import {QrCodeServiceImpl} from '../services/qr-code.service';
import {StallServiceImpl} from '../services/stall/stall-service-impl';
import {SessionPopupComponent} from '../components/session-popup/session-popup.component';
import {LoadingController, ModalController, PopoverController} from '@ionic/angular';
import {QrcodeDetailsComponent} from '../components/qrcode-details/qrcode-details.component';
import {Observable} from 'rxjs';
import {Certificate, ProfileServiceImpl} from '../services/profile/profile-service-impl';
import {faStar as faRegularStar} from '@fortawesome/free-regular-svg-icons/faStar';
import {faStar as faSolidStar} from '@fortawesome/free-solid-svg-icons/faStar';

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
  public faRegularStar = faRegularStar;
  public faSolidStar = faSolidStar;

  constructor(
    private qrcodeService: QrCodeServiceImpl,
    private stallService: StallServiceImpl,
    private popCtrl: PopoverController,
    private modalCtrl: ModalController,
    private profileService: ProfileServiceImpl,
    private loadingCtrl: LoadingController
  ) {
    this.getUserAwardedPoints$ = this.stallService.getUserAwardedPoints();
    this.getProfileCertificates$ = this.profileService.getProfileCertificates();
  }

  certificateNameMap = {
    'Super Reader': 'Super Reader',
    'Contributor': 'Contributor',
    'Winner': 'Winner',
    'Participation certificate': 'Participation',
    'Default': ''
  };

  get ratingsMap() {
    return this.stallService.feedbackRatingsMap;
  }

  get commentsMap() {
    return this.stallService.feedbackCommentsMap;
  }

  public stallList: Stall[] = [];

  qrcodeDataURL?: string;
  public readonly profilePicURL = localStorage.getItem(PreferenceKeys.ProfileAttributes.URL_ATTRIBUTE)!;
  public readonly profileName = localStorage.getItem(PreferenceKeys.ProfileAttributes.NAME_ATTRIBUTE)!;

  getUserAwardedPoints$: Observable<number>;
  getProfileCertificates$: Observable<Certificate[]>;

  arrayGen(size: number): any[] {
    return Array(size);
  }

  async ngOnInit() {
    this.qrcodeDataURL = await this.qrcodeService.generateDataUrl(
      localStorage.getItem(PreferenceKeys.ProfileAttributes.CODE_ATTRIBUTE)!
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

  async expandQrCode() {
    const param = {
      qrImageUrl: this.qrcodeDataURL,
      qrCode: localStorage.getItem(PreferenceKeys.ProfileAttributes.CODE_ATTRIBUTE)
    };
    const modal = await this.modalCtrl.create({
      component: QrcodeDetailsComponent,
      componentProps: param
    });
    modal.present();
  }

  async postFeedback(ratingIndex: number, ideaCode: string) {
    const rating = ratingIndex * 20;

    const loader = await this.loadingCtrl.create({
      message: 'Loading...',
      showBackdrop: true,
      translucent: true,
      spinner: 'crescent'
    });

    await loader.present();

    return this.stallService.postUserFeedback({
      visitorCode: '',
      timestamp: '',
      ideaCode,
      rating: ratingIndex,
      points: (rating as any)
    }).then(() => {
      loader.dismiss();
    }).catch(() => {
      loader.dismiss();
    });
  }
}
