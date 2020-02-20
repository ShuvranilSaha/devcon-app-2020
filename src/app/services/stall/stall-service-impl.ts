import {ApiService, HttpRequestType, Request, Response} from '@project-sunbird/sunbird-sdk';
import {Inject, Injectable} from '@angular/core';
import {Idea, Stall, VisitorActivity} from './stall-service';
import {map, mergeMap, tap} from 'rxjs/operators';
import {BehaviorSubject, interval, Observable} from 'rxjs';
import {PreferenceKeys} from 'src/config/preference-keys';
import {ToastController} from '@ionic/angular';

export interface Vote {
  ideaCode: string;
  visitorCode: string;
  rating: number;
  comment?: string;
  timestamp: string;
  points?: 20 | 40 | 60 | 80 | 100;
}

@Injectable({
  providedIn: 'root'
})
export class StallServiceImpl {

  public readonly exitDetected$ = new BehaviorSubject(
    !!localStorage.getItem(PreferenceKeys.EXIT_DETECTED)
  );

  constructor(
    @Inject('API_SERVICE') private apiService: ApiService,
    private toastController: ToastController
  ) {
    const persistedRatingsMap = localStorage.getItem(PreferenceKeys.ProfileFeedback.RATINGS_MAP);
    const persistedCommentsMap = localStorage.getItem(PreferenceKeys.ProfileFeedback.COMMENTS_MAP);

    if (persistedRatingsMap) {
      this.feedbackRatingsMap = JSON.parse(persistedRatingsMap);
    }

    if (persistedCommentsMap) {
      this.feedbackCommentsMap = JSON.parse(persistedCommentsMap);
    }
  }

  private _feedbackRatingsMap: {
    [ideaCode: string]: number
  } = {};

  get feedbackRatingsMap(): { [p: string]: number } {
    return this._feedbackRatingsMap;
  }

  set feedbackRatingsMap(value: { [p: string]: number }) {
    this._feedbackRatingsMap = value;

    localStorage.setItem(PreferenceKeys.ProfileFeedback.RATINGS_MAP, JSON.stringify(value));
  }

  private _feedbackCommentsMap: {
    [ideaCode: string]: string
  } = {};

  get feedbackCommentsMap(): { [p: string]: string } {
    return this._feedbackCommentsMap;
  }

  set feedbackCommentsMap(value: { [p: string]: string }) {
    this._feedbackCommentsMap = value;

    localStorage.setItem(PreferenceKeys.ProfileFeedback.COMMENTS_MAP, JSON.stringify(value));
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

    public getUserAwardedPoints(): Observable<number> {
        return interval(10 * 1000).pipe(
            mergeMap(() => {
                const request = new Request.Builder()
                    .withType(HttpRequestType.POST)
                    .withPath('/api/reg/search')
                    .withApiToken(true)
                    .withBody({
                        request: {
                            entityType: ['VisitorActivity'],
                            filters: {
                                visitorCode: {
                                    eq: localStorage.getItem(PreferenceKeys.ProfileAttributes.CODE_ATTRIBUTE)!
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
                            VisitorActivity: VisitorActivity[]
                        },
                    }>) => {
                        return r.body;
                    }),
                    map((r) => {
                        if (r.params.status !== 'SUCCESSFUL') {
                            throw new Error('UNEXPECTED_RESPONSE');
                        }

                      return r.result.VisitorActivity.reduce((acc, i) => {
                        acc += i.points;
                        return acc;
                      }, 0);
                    }),
                );
            })
        );
    }

  public postUserFeedback(vote: Exclude<Vote, 'visitorCode' | 'timestamp'>): Promise<undefined> {
    const votePatched: Vote = {
      ...vote,
      visitorCode: localStorage.getItem(PreferenceKeys.ProfileAttributes.CODE_ATTRIBUTE)!,
      timestamp: Date.now() + ''
    };

    const request = new Request.Builder()
      .withType(HttpRequestType.POST)
      .withPath('/api/reg/add')
      .withApiToken(true)
      .withBody({
        request: {
          Vote: votePatched
        }
      })
      .build();

    return this.apiService.fetch(request).pipe(
      map((r: Response<{
        params: {
          status: 'SUCCESSFUL' | 'UNSUCCESSFUL'
        },
        result: {
          osid: string
        },
      }>) => {
        return r.body;
      }),
      tap(() => {
        if (vote.points) {
          this.feedbackRatingsMap[vote.ideaCode] = vote.points;
        }

        if (vote.comment) {
          this.feedbackCommentsMap[vote.ideaCode] = vote.comment;
        }
      }),
      map((r) => {
        if (r.params.status !== 'SUCCESSFUL') {
          throw new Error('UNEXPECTED_RESPONSE');
        }

        return undefined;
      }),
    ).toPromise();
  }

  public async onExitDetected() {
    this.exitDetected$.next(true);
    localStorage.setItem(PreferenceKeys.EXIT_DETECTED, 'true');

    const toast = await this.toastController.create({
      message: 'Thanks for participating in DevCon',
      duration: 2000
    });

    toast.present();
  }
}
