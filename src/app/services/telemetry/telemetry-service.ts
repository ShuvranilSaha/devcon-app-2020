import * as uuidv4 from 'uuid/v4';
import {Inject, Injectable} from '@angular/core';
import {DeviceInfo} from '@project-sunbird/sunbird-sdk';
import {PreferenceKeys} from '../../../config/preference-keys';
import {Request, HttpRequestType} from '@project-sunbird/sunbird-sdk';
import {ApiService} from '@project-sunbird/sunbird-sdk';
import {catchError, mapTo, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TelemetryService {
    constructor(
        @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
        @Inject('API_SERVICE') private apiService: ApiService,
    ) {
    }

    async generateRegisterTelemetry(edata: any): Promise<undefined> {
        const telemetryRequest: RegisterTelemetryRequest = {
            eid: 'DC_REGISTER',
            mid: uuidv4(),
            ets: Date.now(),
            did: this.deviceInfo.getDeviceID(),
            profileId: localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)!,
            edata
        };

        return this.invokeApi(telemetryRequest);
    }

    getStallVisitTelemetry(stallId: string, ideaId: any, edata: any): Promise<undefined> {
        const telemetryRequest: StallVisitTelemetryRequest = {
            eid: 'DC_VISIT',
            mid: uuidv4(),
            ets: Date.now(),
            did: this.deviceInfo.getDeviceID(),
            profileId: localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)!,
            stallId,
            ideaId,
            edata
        };
        return this.invokeApi(telemetryRequest);
    }

    // getUserAssessmentTelemetry(edata: any): Promise<undefined> {
    //
    // }
    //

    getUserStallExitTelemetry(stallId: string, ideaId: string, edata: any): Promise<undefined> {
        const telemetryRequest: ExitTelemetryRequest = {
            eid: 'DC_EXIT',
            mid: uuidv4(),
            ets: Date.now(),
            did: this.deviceInfo.getDeviceID(),
            profileId: localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)!,
            stallId,
            ideaId,
            edata
        };
        return this.invokeApi(telemetryRequest);
    }

    getUserPointsEarnTelemetry(stallId: string, ideaId: string, edata: any): Promise<undefined> {
        const telemetryRequest: PointsEarnTelemetryRequest = {
            eid: 'DC_EARN',
            mid: uuidv4(),
            ets: Date.now(),
            did: this.deviceInfo.getDeviceID(),
            profileId: localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)!,
            stallId,
            ideaId,
            edata: {
                type: edata.type,
                points: edata.points,
                badges: []
            }
        };
        return this.invokeApi(telemetryRequest);
    }

    generateAttendanceTelemetry(stallId: string, ideaId: string, sid: string): Promise<undefined> {
        const telemetryRequest: AttendanceTelemetryRequest = {
            eid: 'DC_ATTENDANCE',
            mid: uuidv4(),
            ets: Date.now(),
            did: this.deviceInfo.getDeviceID(),
            profileId: localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)!,
            stallId,
            ideaId,
            sid,
            edata: {
                profileUrl: localStorage.getItem(PreferenceKeys.ProfileAttributes.URL_ATTRIBUTE)!,
                name: localStorage.getItem(PreferenceKeys.ProfileAttributes.NAME_ATTRIBUTE)!,
                osid: localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)!,
              }
        };
        return this.invokeApi(telemetryRequest);
    }


    private invokeApi(telemetryRequest: BaseTelemetryRequest): Promise<undefined> {
        const request = new Request.Builder()
            .withType(HttpRequestType.POST)
            .withPath('/content/data/v1/telemetry')
            .withApiToken(true)
            .withBody({
                id: 'api.sunbird.telemetry',
                ver: '3.0',
                params: {
                    msgid: uuidv4(),
                },
                ets: Date.now(),
                events: [
                    telemetryRequest
                ] as BaseTelemetryRequest[]
            })
            .build();
        return this.apiService.fetch(request).pipe(
            mapTo(undefined),
            tap(() => console.log('telemetry logged:', request._body)),
            catchError((e) => {
                console.error(e);
                throw e;
            })
        ).toPromise();
    }
}
