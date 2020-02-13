import {AttendanceTelemetry, BuyIdeaTelemetry, FeedbackTelemetry, RegisterTelemetry} from './telemetry-requests';

export interface TelemetryService {
    generateRegisterTelemetry(request: RegisterTelemetry): Promise<undefined>;

    generateAttendanceTelemetry(request: AttendanceTelemetry): Promise<undefined>;

    generateBuyIdeaTelemetry(request: BuyIdeaTelemetry): Promise<undefined>;

    generateFeedbackTelemetry(request: FeedbackTelemetry): Promise<undefined>;
}
