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
      this.openClassAssignment();
    });

    this.oneSignal.handleNotificationOpened().subscribe((data: any) => {

      const additionalData = data.notification.payload.additionalData;

      this.openClassAssignment();
    });

    this.oneSignal.endInit();
  }

  openClassAssignment() {
    (window as any).chathead.showChatHead('do_12', 'did_123', 'profile_123', 'student_123',
        'stall_123', 'idea_123', 'sid_123', () => {
        }, () => {
        });
  }

  openHomeAssignment() {
    (window as any).chathead.showChatHead('do_12', 'did_123', 'profile_123', 'student_123',
        'stall_123', 'idea_123', 'sid_123', () => {
        }, () => {
        });
  }
}
