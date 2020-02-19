import { Component, OnInit, Inject } from '@angular/core';
import { PushNotificationService } from 'src/app/services/push-notification';
import { PopoverController } from '@ionic/angular';
import { DeviceInfo } from '@project-sunbird/sunbird-sdk';
import * as uuidv4 from 'uuid/v4';

@Component({
  selector: 'app-session-popup',
  templateUrl: './session-popup.component.html',
  styleUrls: ['./session-popup.component.scss'],
})
export class SessionPopupComponent implements OnInit {

  sessionId = '';
  incorrectSessionId = false;
  constructor(
    private pushNotificationService: PushNotificationService,
    private popoverCtrl: PopoverController) { }

  ngOnInit() { }

  submitSessionId() {
    const sessionId = this.sessionId.trim();
    this.pushNotificationService.sendSessionId(sessionId).then(res => {
      console.log(res);
      if (res === 1) {
        this.pushNotificationService.assignNotificationTags(sessionId);
        this.generateSessionIdTelemetry(sessionId);
        this.popoverCtrl.dismiss();
      } else if (res === 0) {
        this.incorrectSessionId = true;
        this.pushNotificationService.removeNotificationTags();
      }
    });
  }

  resetIncorrectFlag() {
    this.incorrectSessionId = false;
  }

  private generateSessionIdTelemetry(sessionId: string) {
    const deviceId = this.pushNotificationService.getDeviceId();
    const uuid = this.pushNotificationService.getUuid();
    const osid = this.pushNotificationService.getOsid();

    const payload = {
      eid: 'DC_VISIT',
      mid: uuid,
      ets: Date.now(),
      did: deviceId,
      profileId: osid,
      teacherId: '',
      studentId: '',
      stallId: 'STALL_ID_1',
      ideaId: 'IDEA_ID_1',
      sid: sessionId,
      contentId: '',
      contentType: '',
      contentName: '',
      edata: {}
    };
    console.log(payload);

  }

}
