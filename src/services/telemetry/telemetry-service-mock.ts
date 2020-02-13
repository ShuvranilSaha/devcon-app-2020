import {TelemetryService} from './telemetry-services';
import {Injectable} from '@angular/core';
import {AttendanceTelemetry, BuyIdeaTelemetry, FeedbackTelemetry, RegisterTelemetry} from './telemetry-requests';

@Injectable()
export class TelemetryServiceMock implements TelemetryService {
    public async generateAttendanceTelemetry(request: AttendanceTelemetry): Promise<undefined> {
        console.log('Attendance telemetry: ', request);
        return;
    }

    public async generateBuyIdeaTelemetry(request: BuyIdeaTelemetry): Promise<undefined> {
        console.log('Buy Idea telemetry: ', request);
        return;
    }

    public async generateFeedbackTelemetry(request: FeedbackTelemetry): Promise<undefined> {
        console.log('Feedback telemetry: ', request);
        return;
    }

    public async generateRegisterTelemetry(request: RegisterTelemetry): Promise<undefined> {
        console.log('Register telemetry: ', request);
        return;
    }

}
