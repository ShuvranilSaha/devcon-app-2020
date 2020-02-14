import {Injectable} from '@angular/core';
import {ApiLogger} from './util/api-logger';
import {ErrorHandler} from './util/error-handler';
import {HTTP} from '@ionic-native/http/ngx';

@Injectable()
export class ApiHandlerService {
    constructor(private http: HTTP) {
    }

    public handle<T>(url: string, body: any): Promise<T> {
        ApiLogger.logApiRequest(url, body);

        this.http.setDataSerializer('json');

        return this.http.post(url, body, {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }).then(async (res) => ErrorHandler.parseApiResponse(res));
    }
}
