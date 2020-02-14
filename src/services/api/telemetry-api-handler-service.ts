import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';
import {ApiLogger} from './util/api-logger';

@Injectable()
export class TelemetryApiHandlerService {
    constructor(private http: HTTP) {
    }

    public handle<T>(url: string, body: any): Promise<T> {
        ApiLogger.logApiRequest(url, body);

        this.http.setDataSerializer('json');

        return this.http.post(url, body, {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }).then(async () => undefined);
    }
}
