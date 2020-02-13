import {HTTPResponse} from '@ionic-native/http';

export class ErrorHandler {
    public static parseApiResponse(res: HTTPResponse): any {
        try {
            res.data = JSON.parse(res.data);
        } catch (e) {
            throw new Error('Could not parse Response');
        }

        if (res.data.params.status === 'SUCCESSFUL') {
            return res.data.result;
        } else {
            throw new Error('Network Error: ' + JSON.stringify(res));
        }
    }
}