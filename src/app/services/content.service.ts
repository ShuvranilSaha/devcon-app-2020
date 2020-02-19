import { Injectable, Inject } from '@angular/core';
import { ContentService, ContentImportResponse, ContentImportStatus } from '@project-sunbird/sunbird-sdk';

@Injectable({
    providedIn: 'root'
})
export class ContentUtil {

    constructor(
        @Inject('CONTENT_SERVICE') private contentService: ContentService
    ) {
    }

    readFileFromAssets(fileName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                sbutility.readFromAssets(fileName, (entry: string) => {
                    resolve(entry);
                }, err => {
                    reject(err);
                });
            } catch (xc) {
                console.error('readFileFromAssets: error', xc);
                reject(xc);
            }
        });
    }

    public async importContent() {
        const contentFiles = ['quiz1_1582020994576_do_2129599000490065921103_1.0.ecar'];
        const contents: string[] = localStorage.getItem('imported_contents') ?
            JSON.parse(localStorage.getItem('imported_contents')!) : [];
        for (const file of contentFiles) {
            if (contents.includes(file)) {
                continue;
            }
            await this.readFileFromAssets(file)
                .then((assetFilePath) => {
                    console.log('assetFilePath', assetFilePath);
                    const filePath = 'file://' + assetFilePath;
                    // const filePath = cordova.file.applicationDirectory + 'ecar/quiz.ecar';
                    console.log('filePath', filePath);
                    console.log('destinationFolder', cordova.file.externalDataDirectory);
                    this.contentService.importEcar({
                        isChildContent: false,
                        destinationFolder: cordova.file.externalDataDirectory,
                        sourceFilePath: filePath,
                        correlationData: []
                    }).toPromise()
                        .then((response: ContentImportResponse[]) => {
                            console.log('importContent: success: ', response);
                            if (!response.length) {
                                console.log('importContent: success: CONTENT_IMPORTED');
                                return;
                            }

                            response.forEach((contentImportResponse: ContentImportResponse) => {
                                switch (contentImportResponse.status) {
                                    case ContentImportStatus.ALREADY_EXIST:
                                        console.log('importContent: success: ALREADY_EXIST');
                                        throw ContentImportStatus.ALREADY_EXIST;
                                    case ContentImportStatus.IMPORT_FAILED:
                                        console.log('importContent: success: IMPORT_FAILED');
                                        throw ContentImportStatus.IMPORT_FAILED;
                                    case ContentImportStatus.NOT_FOUND:
                                        console.log('importContent: success: NOT_FOUND');
                                        throw ContentImportStatus.NOT_FOUND;
                                }
                            });
                        })
                        .catch((error) => {
                            console.error('importContent', error);
                        });
                });

            contents.push(file);
            localStorage.setItem('imported_contents', JSON.stringify(contents));
        }
    }
}
