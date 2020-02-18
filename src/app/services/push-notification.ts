import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(
    private oneSignal: OneSignal,
    private alertCtrl: AlertController
  ) { }

  setupPush() {
    this.oneSignal.startInit('6e98f8cf-67fe-4798-93b9-97955e4858fc', '572777623080');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // Way to add tags for the segments
    // this.oneSignal.sendTags({ all: 'true', teachers: 'true'});

    this.oneSignal.handleNotificationReceived().subscribe((data: any) => {
      console.log(data);
      const msg = data.payload.body;
      const title = data.payload.title;
      const additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    this.oneSignal.handleNotificationOpened().subscribe((data: any) => {

      const additionalData = data.notification.payload.additionalData;

      this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });

    this.oneSignal.endInit();
  }

  async showAlert(title: string, msg: string, task: any) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }
}
