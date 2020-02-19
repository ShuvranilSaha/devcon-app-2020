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
        const contentFiles = [
            'quiz1_1582020994576_do_2129599000490065921103_1.0.ecar',
            'quiz2_1582023330946_do_2129599201136558081111_1.0.ecar',
            'quiz_1582025764578_do_2129599450151239681116_1.0.ecar',
            'quiz_1582029827096_do_2129599565959249921120_1.0.ecar',
            'quiz_1582085204212_do_2129604318973870081128_1.0.ecar',
            'quiz_1582086487102_do_2129604418711306241129_1.0.ecar',
            'quiz_1582089167995_do_2129604657296261121132_1.0.ecar',
            'quiz_1582090143782_do_2129604740764958721133_1.0.ecar',
            'quiz_1582091283631_do_2129604818587484161136_1.0.ecar',
            'quiz_1582092759395_do_2129604931508060161137_1.0.ecar'
        ];
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
