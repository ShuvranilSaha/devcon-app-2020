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
import {TelemetryService} from '../services/telemetry/telemetry-service';
import { PushNotificationService } from '../services/push-notification';
import { DcPopupComponent } from '../components/dc-popup/dc-popup.component';

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

  private isSchoolTapCount = 0;
  private isHomeTapCount = 0;
  private stallList: Stall[] = [];

  qrcodeDataURL?: string;
  public readonly profilePicURL = localStorage.getItem(PreferenceKeys.ProfileAttributes.URL_ATTRIBUTE)!;
  public readonly profileName = localStorage.getItem(PreferenceKeys.ProfileAttributes.NAME_ATTRIBUTE)!;
  savedClassDate: any;
  savedHomeDate: any;

  constructor(
    private qrcodeService: QrCodeServiceImpl,
    private stallService: StallServiceImpl,
    private popCtrl: PopoverController,
    private modalCtrl: ModalController,
    private profileService: ProfileServiceImpl,
    private loadingCtrl: LoadingController,
    private telemetryService: TelemetryService,
    private pushNotificationService: PushNotificationService
  ) {
    this.getUserAwardedPoints$ = this.stallService.getUserAwardedPoints();
    this.getProfileCertificates$ = this.profileService.getProfileCertificates();
  }
  qrCode?: string;
  certificateNameMap: {[key: string]: string} = {
    'Super Reader': 'Super Reader',
    Contributor: 'Contributor',
    Winner: 'Winner',
    'Participation certificate': 'Participation',
    Default: ''
  };

  get ratingsMap() {
    return this.stallService.feedbackRatingsMap;
  }

  get commentsMap() {
    return this.stallService.feedbackCommentsMap;
  }

  getUserAwardedPoints$: Observable<number>;
  getProfileCertificates$: Observable<Certificate[]>;

  arrayGen(size: number): any[] {
    return Array(size);
  }

  async ngOnInit() {
    this.qrcodeDataURL = await this.qrcodeService.generateDataUrl(
      localStorage.getItem(PreferenceKeys.ProfileAttributes.CODE_ATTRIBUTE)!
    );
    this.qrCode = localStorage.getItem(PreferenceKeys.ProfileAttributes.CODE_ATTRIBUTE)!;


    this.stallList = await this.stallService.getStallList();
    console.log('stallList', this.stallList);
    }

  async openHomePopup(ideaName: string) {
    if (ideaName === 'Home assessment') {
      const options = {
        component: DcPopupComponent,
        componentProps: {},
        showBackdrop: true,
        backdropDismiss: true,
        cssClass: 'popup-w100'
      };
      const homePopup = await this.popCtrl.create(options);
      await homePopup.present();
      const { data } = await homePopup.onDidDismiss();

      if (data && data.acceptHomeNotification) {
        this.pushNotificationService.assignHomeNotificationTags();
      }
    }

    if (ideaName === 'Class assessment') {
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

  async exit() {
    const osid = localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)!;
    const code = localStorage.getItem(PreferenceKeys.ProfileAttributes.CODE_ATTRIBUTE)!;
    await this.profileService.exitRegisteredUser(osid, code).then((data) => {
     console.log('exit', data);
    }).catch((e) => {
      console.error(e);
    });
    this.telemetryService.getUserStallExitTelemetry('', '', {
      type: 'VISITOR_EXIT',
      osid,
      code,
    });
  }

  generateTimeCheckDiffClass() {
    const presentDate = new Date();
    if (this.savedClassDate && this.checkSecondsDiffClass(presentDate)) {
      return true;
    } else {
      this.savedClassDate = presentDate;
      return false;
    }
  }

  checkSecondsDiffClass(presentDate: any) {
    const diff = presentDate.getTime() - this.savedClassDate.getTime();
    console.log(diff);
    if (diff / 1000 < 2) {
      return true;
    }
    this.isSchoolTapCount = 0;
    return false;
  }

  openHomeAssessment(ideaName: string) {
    if (ideaName === 'Home assessment') {
      if (this.generateTimeCheckDiffHome()) {
        if (this.isHomeTapCount === 1) {
          this.savedHomeDate = null;
          this.isHomeTapCount = 0;
          this.pushNotificationService.openHomeAssignment();
        } else {
          this.isHomeTapCount++;
        }
      }
    } else {
      this.isHomeTapCount = 0;
    }

    if (ideaName === 'Class assessment') {
      if (this.generateTimeCheckDiffClass()) {
        if (this.isSchoolTapCount === 1) {
          this.savedClassDate = null;
          this.isSchoolTapCount = 0;
          this.pushNotificationService.openClassAssignment();
        } else {
          this.isSchoolTapCount++;
        }
      }
    } else {
      this.isSchoolTapCount = 0;
    }

  }

  generateTimeCheckDiffHome() {
    const presentDate = new Date();
    if (this.savedHomeDate && this.checkSecondsDiffHome(presentDate)) {
      return true;
    } else {
      this.savedHomeDate = presentDate;
      return false;
    }
  }

  checkSecondsDiffHome(presentDate: any) {
    const diff = presentDate.getTime() - this.savedHomeDate.getTime();
    console.log(diff);
    if (diff / 1000 < 2) {
      return true;
    }
    this.isHomeTapCount = 0;
    return false;
  }

}
