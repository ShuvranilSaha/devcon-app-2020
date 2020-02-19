import {Component, Inject, OnInit} from '@angular/core';

import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProfileServiceImpl} from '../services/profile/profile-service-impl';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'app-offline-register',
  templateUrl: './offline-register.page.html',
  styleUrls: ['./offline-register.page.scss'],
})
export class OfflineRegisterPage implements OnInit {
  public offlineProfileDetailsForm = new FormGroup({
    vcode: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)])
  });

  get vcodeControl(): FormControl {
    return this.offlineProfileDetailsForm.get('vcode') as FormControl;
  }

  get nameControl(): FormControl {
    return this.offlineProfileDetailsForm.get('name') as FormControl;
  }

  constructor(
      private profileService: ProfileServiceImpl,
      private toastCtrl: ToastController
  ) {}

  ngOnInit() {
  }

  async submitForm() {
    await this.profileService.registerOfflineUser(
        this.vcodeControl.value,
        this.nameControl.value
    ).then(async () => {
      const toast = await this.toastCtrl.create({
        message: 'success',
        duration: 2000
      });
      toast.present();
    }).catch(async () => {
      const toast = await this.toastCtrl.create({
        message: 'fail',
        duration: 2000
      });
      toast.present();
    });

    this.offlineProfileDetailsForm.reset({
      vcode: '',
      name: ''
    });
  }

}
