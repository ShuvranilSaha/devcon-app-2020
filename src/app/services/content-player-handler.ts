import { Injectable, Inject } from '@angular/core';
import { PlayerService, Content, HierarchyInfo, TelemetryObject, Rollup, CorrelationData, Course, } from '@project-sunbird/sunbird-sdk';
import { File } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { CanvasPlayerService } from './canvas-player.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Injectable({
    providedIn: 'root'
})
export class ContentPlayerHandler {
    private isPlayerLaunched = false;
    private lastPlayedContentId!: string;

    constructor(
        @Inject('PLAYER_SERVICE') private playerService: PlayerService,
        private canvasPlayerService: CanvasPlayerService,
        private file: File,
        // private telemetryGeneratorService: TelemetryGeneratorService,
        private router: Router,
        private webView: WebView
    ) { }

    /**
     * Launches Content-Player with given configuration
     */
    public launchContentPlayer(
        content: Content, isStreaming: boolean, shouldDownloadnPlay: boolean, contentInfo: ContentInfo, isCourse: boolean,
        isFromTextbookTOC?: boolean) {
        // if (!AppGlobalService.isPlayerLaunched) {
        //     AppGlobalService.isPlayerLaunched = true;
        // }

        if (isStreaming) {
            const extraInfoMap = { hierarchyInfo: [] as HierarchyInfo[] };
            extraInfoMap.hierarchyInfo = contentInfo.hierachyInfo;
        }
        const request: any = {};
        if (isStreaming) {
            request.streaming = isStreaming;
        }
        request.correlationData = contentInfo.correlationList;
        // if (isCourse && content.contentData['totalQuestions']) {
        //     const correlationData: CorrelationData = {
        //         id: this.courseService.generateAssessmentAttemptId({
        //             courseId: contentInfo.course!.identifier,
        //             batchId: contentInfo.course.batchId,
        //             contentId: content.identifier,
        //             userId: contentInfo.course.userId
        //         }),
        //         type: 'AttemptId'
        //     };

        //     if (request['correlationData']) {
        //         request['correlationData'].push(correlationData);
        //     }

        //     request['correlationData'] = [correlationData];
        // }
        this.playerService.getPlayerConfig(content, request).subscribe((data: any) => {
            data.data = {};
            if (isCourse || (content.contentData)) {
                data.config.overlay.enableUserSwitcher = false;
                data.config.overlay.showUser = false;
            } else {
                data.config.overlay.enableUserSwitcher = true;
            }
            this.lastPlayedContentId = content.identifier;
            this.isPlayerLaunched = true;
            if (data.metadata.mimeType === 'application/vnd.ekstep.ecml-archive') {
                const filePath = this.convertFileSrc(`${data.metadata.basePath}`);
                if (!isStreaming) {
                    this.file.checkFile(`file://${data.metadata.basePath}/`, 'index.ecml').then((isAvailable) => {
                        this.canvasPlayerService.xmlToJSon(`${filePath}/index.ecml`).then((json) => {
                            data.data = JSON.stringify(json);
                            this.router.navigate(['player'],
                                { state: { config: data, course: contentInfo.course, isFromTOC: isFromTextbookTOC } });

                        }).catch((error) => {
                            console.error('error1', error);
                        });
                    }).catch((err) => {
                        console.error('err', err);
                        this.canvasPlayerService.readJSON(`${filePath}/index.json`).then((json) => {
                            data.data = json;
                            this.router.navigate(['player'],
                                {
                                    state: {
                                        config: data, course: contentInfo.course, isFromTOC: isFromTextbookTOC,
                                        corRelation: contentInfo.correlationList
                                    }
                                });

                        }).catch((e) => {
                            console.error('readJSON error', e);
                        });
                    });
                } else {
                    this.router.navigate(['player'],
                        {
                            state: {
                                config: data, course: contentInfo.course, isFromTOC: isFromTextbookTOC,
                                corRelation: contentInfo.correlationList
                            }
                        });
                }

            } else {
                this.router.navigate(['player'],
                    {
                        state: {
                            config: data, course: contentInfo.course, isFromTOC: isFromTextbookTOC,
                            corRelation: contentInfo.correlationList
                        }
                    });
            }
        });
    }
    public isContentPlayerLaunched(): boolean {
        return this.isPlayerLaunched;
    }

    public setContentPlayerLaunchStatus(isPlayerLaunced: boolean) {
        this.isPlayerLaunched = isPlayerLaunced;
    }

    public getLastPlayedContentId(): string {
        return this.lastPlayedContentId;
    }

    public setLastPlayedContentId(contentId: string) {
        this.lastPlayedContentId = contentId;
    }

    convertFileSrc(img?: string) {
        if (img === null) {
            return '';
        } else {
            return this.webView.convertFileSrc(img!);
        }
    }
}

export interface ContentInfo {
    telemetryObject: TelemetryObject;
    rollUp: Rollup;
    correlationList: CorrelationData[];
    hierachyInfo: HierarchyInfo[];
    course?: Course;
}
