import { Injectable, Inject } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ContentDetailRequest, Content, TelemetryObject, Rollup, ContentService, CorrelationData } from '@project-sunbird/sunbird-sdk';
import { ContentInfo, ContentPlayerHandler } from './content-player-handler';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private appName: any;
    configDataList = [
        {
            'id': 1001,
            'type': 1,
            'data': {
                'start': '4 13:30',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T13:25:00',
                'endTime': '2020-02-20T13:40:00',
                'msg': 'Can you crack this one?',
                'identifier': 'do_2129599000490065921103'
            }
        },
        {
            'id': 1002,
            'type': 1,
            'data': {
                'start': '4 14:00',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T13:55:00',
                'endTime': '2020-02-20T14:10:00',
                'msg': 'Lets see if you have all the answers!',
                'identifier': 'do_2129599201136558081111'
            }
        },
        {
            'id': 1003,
            'type': 1,
            'data': {
                'start': '4 14:30',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T14:25:00',
                'endTime': '2020-02-20T14:40:00',
                'msg': 'Do you know the answers?',
                'identifier': 'do_2129599450151239681116'
            }
        },
        {
            'id': 1004,
            'type': 1,
            'data': {
                'start': '4 15:00',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T14:55:00',
                'endTime': '2020-02-20T15:10:00',
                'msg': 'Time for another quiz!',
                'identifier': 'do_2129599565959249921120'
            }
        },
        {
            'id': 1005,
            'type': 1,
            'data': {
                'start': '4 15:30',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T15:25:00',
                'endTime': '2020-02-20T15:40:00',
                'msg': 'Lets get those braincells moving!',
                'identifier': 'do_2129604318973870081128'
            }
        },
        {
            'id': 1006,
            'type': 1,
            'data': {
                'start': '4 16:00',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T15:55:00',
                'endTime': '2020-02-20T16:10:00',
                'msg': 'Take a Quiz break...',
                'identifier': 'do_2129604418711306241129'
            }
        },
        {
            'id': 1007,
            'type': 1,
            'data': {
                'start': '4 16:30',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T16:25:00',
                'endTime': '2020-02-20T16:40:00',
                'msg': 'Quiz time! 10 min starts now...',
                'identifier': 'do_2129604657296261121132'
            }
        },
        {
            'id': 1008,
            'type': 1,
            'data': {
                'start': '4 17:00',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T18:55:00',
                'endTime': '2020-02-20T17:10:00',
                'msg': 'Do you remember what you learnt at school?',
                'identifier': 'do_2129604740764958721133'
            }
        },
        {
            'id': 1009,
            'type': 1,
            'data': {
                'start': '4 17:30',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T17:25:00',
                'endTime': '2020-02-20T17:40:00',
                'msg': 'Test your knowledge!',
                'identifier': 'do_2129604818587484161136'
            }
        },
        {
            'id': 1010,
            'type': 1,
            'data': {
                'start': '4 18:00',
                'title': 'Devcon 2020',
                'startTime': '2020-02-20T17:55:00',
                'endTime': '2020-02-20T18:10:00',
                'msg': 'Lets get those braincells moving!',
                'identifier': 'do_2129604931508060161137'
            }
        }
    ];

    constructor(
        private localNotifications: LocalNotifications,
        private contentPlayerHandler: ContentPlayerHandler,
        @Inject('CONTENT_SERVICE') private contentService: ContentService,
    ) {
        this.getAppName();
    }

    setupLocalNotification(): any {
        this.localNotifications.cancelAll();
        this.localNotifications.getScheduledIds().then(async (val) => {
            for (const configData of this.configDataList) {
                if (configData.id !== val[val.length - 1]) {
                    await this.setLocalNotification(configData);
                }
            }
        });
    }

    private setLocalNotification(configData: any) {
        console.log('setLocalNotification');
        return new Promise<string>((resolve, reject) => {
            const trigger = this.triggerConfig(configData);
            this.localNotifications.schedule({
                id: configData.id,
                title: configData.data.title.replace('{{%s}}', this.appName),
                text: configData.data.msg.replace('{{%s}}', this.appName),
                icon: 'res://icon',
                smallIcon: 'res://n_icon',
                trigger
            });
            resolve();
        });
    }

    private triggerConfig(configData: any) {
        console.log('triggerConfig');
        let tempDate = configData.data.start;
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
            if (!isNaN(+configData.data.interval) && typeof (+configData.data.interval) === 'number') {
                every.day = +configData.data.interval;
            } else if (typeof (configData.data.interval) === 'string') {
                every[configData.data.interval] = +tempDate[0];
            }
            every.hour = hour;
            every.minute = minute;
            trigger.every = every;
        } else if (tempDate.length === 3) {
            trigger.firstAt = new Date(configData.data.start);
            trigger.every = configData.data.interval;
            if (configData.data.occurance) {
                trigger.count = configData.data.occurance;
            }
        }
        return trigger;
    }

    private async getAppName() {
        this.appName = 'Devcon 2020';
    }

    handleNotification() {
        for (const configData of this.configDataList) {
            if (configData.data.startTime && configData.data.endTime) {
                const startTime = new Date(configData.data.startTime);
                const endTime = new Date(configData.data.endTime);
                const now = new Date();
                if (now.getTime() > startTime.getTime() && now.getTime() < endTime.getTime()) {
                    console.log('handleNotification');
                    this.playContent(configData.data.identifier);
                }
            }
        }
    }

    playContent(identifier: string) {
        const req: ContentDetailRequest = {
            contentId: identifier,
            attachFeedback: true,
            attachContentAccess: true,
            emitUpdateIfAny: false
        };
        this.contentService.getContentDetails(req).toPromise()
            .then(async (data: Content) => {
                if (data) {
                    const cdata: CorrelationData[] = [
                        { type: 'Visitor', id: localStorage.getItem('CODE_ATTRIBUTE')!.toString() },
                        { type: 'Time', id: '' + Date.now() },
                    ];
                    const contentInfo: ContentInfo = {
                        telemetryObject: new TelemetryObject('', '', ''),
                        rollUp: new Rollup(),
                        correlationList: cdata,
                        hierachyInfo: [],
                        course: undefined
                    };
                    this.contentPlayerHandler.launchContentPlayer(data, false, false, contentInfo, false);
                }
            })
            .catch(async (error: any) => {
                console.error('getContentDetails', error);
            });
    }

}
