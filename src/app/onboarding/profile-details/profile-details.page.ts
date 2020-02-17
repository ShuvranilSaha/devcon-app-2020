import {Component, Inject, OnInit} from '@angular/core';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SharedPreferences} from '@project-sunbird/sunbird-sdk';
import {PreferenceKeys} from '../../../config/preference-keys';
import {NavController} from '@ionic/angular';


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
      private navCtrl: NavController

  ) {
  }

  ngOnInit() {
  }

  async submitForm() {
    this.submitSuccess = true;
    // todo: call api
    await this.sharedPreferences.putBoolean(PreferenceKeys.Onboarding.PROFILE_DETAILS_COMPLETE, true).toPromise();
    await this.navCtrl.navigateRoot('/walk-through', {
      animated: true, animationDirection: 'forward'
    });
  }

}
