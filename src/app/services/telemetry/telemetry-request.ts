interface BaseTelemetryRequest {
    'eid': string;
    'mid': string;
    'ets': number;
    'did': string;
    'profileId'?: string; // Visitor Id
    'teacherId'?: string; // Optional, Teacher profile Id
    'studentId'?: string; // Optional, Student profile Id
    'stallId'?: string; // Stall unique id
    'ideaId'?: string; // Idea unique id
    'sid'?: string; // Unique id for each game session (Present only for quiz)
    'contentId'?: string;
    'contentType'?: string;
    'contentName'?: string;
    'edata': any;
}

interface RegisterTelemetryRequest extends BaseTelemetryRequest {
    eid: string;
    mid: string;
    ets: number;
    did: string;
    profileId: string;
    edata: any;
}

interface StallVisitTelemetryRequest extends BaseTelemetryRequest {
    eid: string;
    mid: string;
    ets: number;
    did: string;
    profileId: string;
    stallId: string;
    ideaId: string;
    edata: any;
}

interface ExitTelemetryRequest extends BaseTelemetryRequest {
    eid: string;
    mid: string;
    ets: number;
    did: string;
    profileId: string;
    stallId: string;
    ideaId: string;
}

interface PointsEarnTelemetryRequest extends BaseTelemetryRequest {
    eid: string;
    mid: string;
    ets: number;
    did: string;
    profileId: string;
    studentId?: string;
    stallId: string;
    ideaId: string;
    edata: {
        type: string,
        points: number,
        badges: Array<string>
    };
}
