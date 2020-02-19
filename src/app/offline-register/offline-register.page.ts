import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {faUser} from '@fortawesome/free-regular-svg-icons/faUser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProfileServiceImpl} from '../services/profile/profile-service-impl';
import {LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {AndroidPermissionsService} from '../services/android-permissions.service';
import {ProfileFaceScanPage} from '../onboarding/profile-face-scan/profile-face-scan.page';
import {SharedPreferences} from '@project-sunbird/sunbird-sdk/dist';

@Component({
  selector: 'app-offline-register',
  templateUrl: './offline-register.page.html',
  styleUrls: ['./offline-register.page.scss'],
})
export class OfflineRegisterPage extends ProfileFaceScanPage {
  faUser = faUser;

  @ViewChild('cameraPreviewRef', {static: false, read: ElementRef}) cameraPreviewRef!: ElementRef;
  @ViewChild('cameraIosPreviewRef', {static: false, read: ElementRef}) cameraIosPreviewRef!: ElementRef;
  @ViewChild('canvasPreviewRef', {static: false, read: ElementRef}) canvasPreviewRef!: ElementRef;
  @ViewChild('facePreviewRef', {static: false, read: ElementRef}) facePreviewRef!: ElementRef;

  public offlineProfileDetailsForm = new FormGroup({
    image: new FormControl(null, [Validators.required]),
    vcode: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)])
  });

  get imageControl(): FormControl {
    return this.offlineProfileDetailsForm.get('image') as FormControl;
  }

  get vcodeControl(): FormControl {
    return this.offlineProfileDetailsForm.get('vcode') as FormControl;
  }

  get nameControl(): FormControl {
    return this.offlineProfileDetailsForm.get('name') as FormControl;
  }

  constructor(
      @Inject('SHARED_PREFERENCES') protected sharedPreferences: SharedPreferences,
      protected androidPermissionsService: AndroidPermissionsService,
      protected loadingCtrl: LoadingController,
      protected navCtrl: NavController,
      protected platform: Platform,
      protected profileService: ProfileServiceImpl,
      protected toastCtrl: ToastController
  ) {
    super(
      sharedPreferences,
      androidPermissionsService,
      loadingCtrl,
      navCtrl,
      platform,
      profileService
    );
  }

  async submitForm() {
    const loader = await this.loadingCtrl.create({
      message: 'Loading...',
      showBackdrop: true,
      translucent: true,
      spinner: 'crescent'
    });

    await loader.present();

    await this.profileService.registerOfflineUser(
      this.imageControl.value,
      this.vcodeControl.value,
      this.nameControl.value
    ).then(async () => {
      await loader.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'success',
        duration: 2000
      });
      toast.present();
    }).catch(async (e) => {
      console.error(e);
      await loader.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'fail',
        duration: 2000
      });
      toast.present();
    });

    this.resetForm();
  }

  resetForm() {
    this.offlineProfileDetailsForm.reset({
      image: null,
      vcode: '',
      name: ''
    });
  }

  onFaceCaptured() {
    super.onFaceCaptured();

    (this.facePreviewRef.nativeElement as HTMLCanvasElement).toBlob((b) => {
        this.imageControl.patchValue(b as Blob);
      },
      'image/png'
    );
  }

}
