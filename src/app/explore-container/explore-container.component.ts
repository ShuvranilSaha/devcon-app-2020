import {Component, Input, OnInit} from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { SessionPopupComponent } from '../components/session-popup/session-popup.component';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name!: string;

  constructor(
    private popCtrl: PopoverController
  ) { }

  ngOnInit() {}

  async openSessionPopup() {
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
