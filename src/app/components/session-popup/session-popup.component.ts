import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from 'src/app/services/push-notification';
import { PopoverController } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry/telemetry-service';

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
    private popoverCtrl: PopoverController,
    private telemetryService: TelemetryService
  ) { }

  ngOnInit() { }

  submitSessionId() {
    const sessionId = this.sessionId.trim();
    this.pushNotificationService.sendSessionId(sessionId).then(res => {
      console.log(res);
      if (res === 1) {
        this.pushNotificationService.assignNotificationTags(sessionId);
        this.telemetryService.generateAttendanceTelemetry('STA2', 'IDE9', sessionId);
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

}
