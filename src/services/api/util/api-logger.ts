export class ApiLogger {
    public static logApiRequest(url, body) {
        console.info('API Request:');
        console.info('API URL: ' + url);
        console.info('API BODY: ', JSON.stringify(body));
    }
}