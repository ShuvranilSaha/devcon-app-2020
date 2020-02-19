import { Component, OnInit, Inject } from '@angular/core';
import { PushNotificationService } from 'src/app/services/push-notification';
import { PopoverController } from '@ionic/angular';
import { DeviceInfo } from '@project-sunbird/sunbird-sdk';
import * as uuidv4 from 'uuid/v4';
import { TelemetryService } from 'src/app/services/telemetry/telemetry-service';

@Component({
  selector: 'app-dc-popup',
  templateUrl: './dc-popup.component.html',
  styleUrls: ['./dc-popup.component.scss'],
})
export class DcPopupComponent implements OnInit {

  sessionId = '';
  incorrectSessionId = false;
  constructor(
    private pushNotificationService: PushNotificationService,
    private popoverCtrl: PopoverController,
    private telemetryService: TelemetryService
  ) { }

  ngOnInit() { }

  acceptHomeAssessment() {
    this.popoverCtrl.dismiss({acceptHomeNotification: true});
  }

}
