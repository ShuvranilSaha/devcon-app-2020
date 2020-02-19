import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Request, Response, DeviceInfo } from '@project-sunbird/sunbird-sdk';
import { ApiService, HttpRequestType } from '@project-sunbird/sunbird-sdk/dist';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';
import { PreferenceKeys } from 'src/config/preference-keys';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  sessionId = '';
  constructor(
    @Inject('API_SERVICE') private apiService: ApiService,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    private oneSignal: OneSignal
  ) { }

  setupPush() {
    this.oneSignal.startInit('6e98f8cf-67fe-4798-93b9-97955e4858fc', '572777623080');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // Way to add tags for the segments
    this.oneSignal.sendTags({ all: 'true', teachers: 'true' });
    // this.oneSignal.sendTag("sessionId", "id_swayangjit");

    this.oneSignal.handleNotificationReceived().subscribe((data: any) => {
      console.log(data);
      // const msg = data.payload.body;
      // const title = data.payload.title;
      // const additionalData = data.payload.additionalData;
      this.openClassAssignment();
    });

    this.oneSignal.handleNotificationOpened().subscribe((data: any) => {

      // const additionalData = data.notification.payload.additionalData;

      this.openClassAssignment();
    });

    this.oneSignal.endInit();
  }

  openClassAssignment() {
    const deviceId = this.getDeviceId();
    (window as any).chathead.showChatHead('', deviceId, '', '',
      'STALL_ID_1', 'IDEA_ID_1', this.sessionId, () => {
      }, () => {
      });
  }

  openHomeAssignment() {
    const deviceId = this.getDeviceId();
    (window as any).chathead.showChatHead('', deviceId, '', '',
      'STALL_ID_1', 'IDEA_ID_1', this.sessionId, () => {
      }, () => {
      });
  }

  sendSessionId(sessionId: string) {
    const request = new Request.Builder()
      .withType(HttpRequestType.POST)
      .withPath('/action/composite/v3/search')
      .withApiToken(true)
      .withBody({
        request: {
          filters: {
            objectType: 'Period',
            sessionId,
            status: []
          },
          limit: 1
        }
      })
      .build();

    return this.apiService.fetch(request).pipe(
      map((r: Response<{
        params: {
          status: 'successful' | 'unsuccessful'
        },
        result: {
          count: number,
          Period: []
        } | undefined,
      }>) => {
        return r.body;
      }),
      map((r) => {
        console.log(r);
        if (r.params.status !== 'successful') {
          throw new Error('UNEXPECTED_RESPONSE');
        }

        return r.result!.count;
      }),
    ).toPromise();
  }

  assignNotificationTags(sessionId: string) {
    this.oneSignal.sendTag('sessionId', sessionId);
    this.sessionId = sessionId;
  }

  removeNotificationTags() {
    this.oneSignal.sendTag('sessionId', '');
    this.sessionId = '';
  }

  getDeviceId(): string {
    return this.deviceInfo.getDeviceID();
  }

  getUuid() {
    return uuidv4();
  }

  getOsid() {
    const osid = localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)
    return osid;
  }

}
