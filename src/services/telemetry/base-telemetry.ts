export enum Telemetry_IDs {
    DC_BUY = 'DC_BUY',
    DC_FEEDBCK = 'DC_FEEDBCK',
    DC_REGISTER = 'DC_REGISTER',
    DC_START = 'DC_START'
}

export interface Telemetry {
    eid: Telemetry_IDs;
    ets: number;
    did: string;
    dimensions: any;
    edata: any;
}


