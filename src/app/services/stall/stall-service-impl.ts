import { ApiService, HttpRequestType } from '@project-sunbird/sunbird-sdk';
import { Request, Response } from '@project-sunbird/sunbird-sdk';
import { Inject, Injectable } from '@angular/core';
import { Stall, Idea } from './stall-service';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class StallServiceImpl {

    constructor(
        @Inject('API_SERVICE') private apiService: ApiService
    ) {
    }

    public async getStallList(): Promise<Stall[]> {
        const request = new Request.Builder()
            .withType(HttpRequestType.POST)
            .withPath('/api/reg/search')
            .withApiToken(true)
            .withBody({
                request: {
                    entityType: ['Stall'],
                    filters: {}
                }
            })
            .build();

        const stallList: Stall[] = await this.apiService.fetch(request).pipe(
            map((r: Response<{
                params: {
                    status: 'SUCCESSFUL' | 'UNSUCCESSFUL'
                },
                result: {
                    Stall: Stall[]
                },
            }>) => {
                return r.body;
            }),
            map((r) => {
                if (r.params.status !== 'SUCCESSFUL') {
                    throw new Error('UNEXPECTED_RESPONSE');
                }

                return r.result.Stall;
            }),
        ).toPromise();

        const ideaList: Idea[] = await this.getIdeaList();

        stallList.forEach((stall: Stall) => {
            stall.ideas = ideaList.filter((idea) => idea.stallCode === stall.code);
        });

        return stallList;
    }

    public async getIdeaList(): Promise<Idea[]> {
        const request = new Request.Builder()
            .withType(HttpRequestType.POST)
            .withPath('/api/reg/search')
            .withApiToken(true)
            .withBody({
                request: {
                    entityType: ['Idea'],
                    filters: {}
                }
            })
            .build();


        return this.apiService.fetch(request).pipe(
            map((r: Response<{
                params: {
                    status: 'SUCCESSFUL' | 'UNSUCCESSFUL'
                },
                result: {
                    Idea: Idea[]
                },
            }>) => {
                return r.body;
            }),
            map((r) => {
                if (r.params.status !== 'SUCCESSFUL') {
                    throw new Error('UNEXPECTED_RESPONSE');
                }

                return r.result.Idea;
            }),
        ).toPromise();
    }

    public getUserAwardedPoints(eq: string): Promise<number> {
        const request = new Request.Builder()
            .withType(HttpRequestType.POST)
            .withPath('/api/reg/search')
            .withApiToken(true)
            .withBody({
                request: {
                    entityType: ['VisitorActivity'],
                    filters: {
                        visitorCode: {
                            eq
                        }
                    }
                }
            })
            .build();

        return this.apiService.fetch(request).pipe(
            map((r: Response<{
                params: {
                    status: 'SUCCESSFUL' | 'UNSUCCESSFUL'
                },
                result: {
                    VisitorActivity: number
                },
            }>) => {
                return r.body;
            }),
            map((r) => {
                if (r.params.status !== 'SUCCESSFUL') {
                    throw new Error('UNEXPECTED_RESPONSE');
                }

                return r.result.VisitorActivity;
            }),
        ).toPromise();
    }
}
