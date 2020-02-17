import {Component, Inject, OnInit} from '@angular/core';
import {SharedPreferences} from '@project-sunbird/sunbird-sdk';
import {NavController} from '@ionic/angular';
import {PreferenceKeys} from '../../config/preference-keys';

@Component({
    selector: 'app-walkthrough',
    templateUrl: './walkthrough.page.html',
    styleUrls: ['./walkthrough.page.scss'],
})
export class WalkthroughPage implements OnInit {

    constructor(
        @Inject('SHARED_PREFERENCES') private sharedPreferences: SharedPreferences,
        private navCtrl: NavController
    ) {
    }

    ngOnInit() {
    }

    async continue() {
        // completed walkthrough screens
        await this.sharedPreferences.putBoolean(PreferenceKeys.Walkthrough.WALKTHROUGH_COMPLETE, true).toPromise();
        // navigate to home page
        await this.navCtrl.navigateRoot('/home', {animated: true, animationDirection: 'forward'});
    }
}
