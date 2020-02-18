import {Component, Inject, OnInit} from '@angular/core';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SharedPreferences} from '@project-sunbird/sunbird-sdk';
import {PreferenceKeys} from '../../../config/preference-keys';
import {NavController} from '@ionic/angular';
import {ProfileServiceImpl} from '../../services/profile/profile-service-impl';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  readonly faLock = faLock;
  readonly faPaperPlane = faPaperPlane;
  public submitSuccess = false;

  public profileDetailsForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)])
  });

  get nameControl(): FormControl {
    return this.profileDetailsForm.get('name') as FormControl;
  }

  constructor(
    @Inject('SHARED_PREFERENCES') private sharedPreferences: SharedPreferences,
    private navCtrl: NavController,
    private profileService: ProfileServiceImpl
  ) {
  }

  ngOnInit() {
  }

  async submitForm() {
    this.submitSuccess = true;

    const name = this.nameControl.value;
    const {osid} = await this.profileService.registerName(name);

    localStorage.setItem(PreferenceKeys.ProfileAttributes.NAME_ATTRIBUTE, name);
    localStorage.setItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE, osid);

    const {code} = await this.profileService.getProfile(osid);

    localStorage.setItem(PreferenceKeys.ProfileAttributes.CODE_ATTRIBUTE, code);
    window.localStorage.setItem(PreferenceKeys.Onboarding.PROFILE_DETAILS_COMPLETE, 'true');

    setTimeout(async () => {
      await this.navCtrl.navigateRoot('/onboarding/profile-face-scan', {
        animated: true, animationDirection: 'forward'
      });
    }, 1000);
  }

}
