import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private appName: any;
    private identifier: any;
    private externalUrl: any;
    configData: any = {
        'id': 1004,
        'type': 1,
        'data': {
            'start': '1 17:24',
            'title': 'Devcon 2020',
            'msg': 'Learn something new on {{%s}} today!',
            'identifier': 'do_id'
        }
    };

    constructor(
        private localNotifications: LocalNotifications,
    ) {
        this.getAppName();
    }

    setupLocalNotification(): any {
        this.localNotifications.cancelAll();
        this.localNotifications.getScheduledIds().then((val) => {
            if (this.configData.id !== val[val.length - 1]) {
                this.setLocalNotification();
            }
        });
    }

    private triggerConfig() {
        console.log('triggerConfig');
        let tempDate = this.configData.data.start;
        tempDate = tempDate.split(' ');
        const hour = +tempDate[1].split(':')[0];
        const minute = +tempDate[1].split(':')[1];
        tempDate = tempDate[0].split('/');
        const trigger: any = {};


        if (tempDate.length === 1) {
            const every: any = {
                minute: '',
                hour: ''
            };
            if (!isNaN(+this.configData.data.interval) && typeof (+this.configData.data.interval) === 'number') {
                every.day = +this.configData.data.interval;
            } else if (typeof (this.configData.data.interval) === 'string') {
                every[this.configData.data.interval] = +tempDate[0];
            }
            every.hour = hour;
            every.minute = minute;
            trigger.every = every;
        } else if (tempDate.length === 3) {
            trigger.firstAt = new Date(this.configData.data.start);
            trigger.every = this.configData.data.interval;
            if (this.configData.data.occurance) {
                trigger.count = this.configData.data.occurance;
            }
        }
        return trigger;
    }

    private setLocalNotification() {
        console.log('setLocalNotification');
        const trigger = this.triggerConfig();
        this.localNotifications.schedule({
            id: this.configData.id,
            title: this.configData.data.title.replace('{{%s}}', this.appName),
            text: this.configData.data.msg.replace('{{%s}}', this.appName),
            icon: 'res://icon',
            smallIcon: 'res://n_icon',
            trigger
        });
    }

    private async getAppName() {
        this.appName = 'Devcon 2020';
    }

    async handleNotification() {
        if (this.identifier) {
            // this.splaschreenDeeplinkActionHandlerDelegate.navigateContent(this.identifier);
            this.identifier = null;
        } else if (this.externalUrl) {
            open(this.externalUrl);
            this.externalUrl = null;
        }
    }

}
