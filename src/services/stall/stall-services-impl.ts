import {StallService} from './stall-service';
import {Inject, Injectable} from '@angular/core';
import {Stall} from './Stall';
import {BuyIdeaRequest, FeedbackRequest, GetIdeasRequest, GetStallsRequest} from './requests';
import {GetIdeasResponse} from './responses';
import {AppConfig} from '../../config/AppConfig';
import {ApiHandlerService} from '../api/api-handler-service';
import {BoughtIdea, BoughtIdeas} from './BoughtIdeas';
import {PreferenceKey} from '../../config/constants';
import {BehaviorSubject, Observable} from 'rxjs';
import {AppPreferences} from '@ionic-native/app-preferences/ngx';

@Injectable()
export class StallServicesImpl implements StallService {
    private static GET_STALLS_ENDPOINT = '/search';
    private static GET_IDEAS_ENDPOINT = '/read-dev';
    private static BUY_IDEA_ENDPOINT = '/add';
    private static GIVE_FEEDBACK_ENDPOINT = '/add';

    private boughtIdeas$: BehaviorSubject<BoughtIdeas> =
        new BehaviorSubject<BoughtIdeas>(JSON.parse(localStorage.getItem(PreferenceKey.USER_BOUGHT_IDEAS)));

    constructor(private apiHandler: ApiHandlerService,
                private appPreferences: AppPreferences,
                @Inject('APP_CONFIG') private appConfig: AppConfig) {
    }

    getStalls(getStallsRequest: GetStallsRequest): Promise<Stall[]> {
        const url = this.appConfig.baseUrl + StallServicesImpl.GET_STALLS_ENDPOINT;

        const body = {
            id: 'open-saber.registry.search',
            request: getStallsRequest
        };

        return this.apiHandler.handle(url, body);
    }

    getIdeas(getIdeasRequest: GetIdeasRequest): Promise<GetIdeasResponse> {
        const url = this.appConfig.baseUrl + StallServicesImpl.GET_IDEAS_ENDPOINT;

        const body = {
            id: 'open-saber.registry.read',
            request: getIdeasRequest
        };

        return this.apiHandler.handle(url, body);
    }

    public async buyIdea(buyIdeaRequest: BuyIdeaRequest): Promise<undefined> {
        const url = this.appConfig.baseUrl + StallServicesImpl.BUY_IDEA_ENDPOINT;

        const body = {
            id: 'open-saber.registry.create',
            request: {
                Vote: {
                    nCoins: this.appConfig.coinsPerIdea,
                    ideaCode: buyIdeaRequest.ideaCode,
                    visitorCode: await this.appPreferences.fetch(PreferenceKey.USER_CODE)
                }
            }
        };

        await this.apiHandler.handle(url, body);

        const key = `${buyIdeaRequest.stallCode}-${buyIdeaRequest.ideaCode}`;

        const boughtIdeas: BoughtIdeas = JSON.parse(localStorage.getItem(PreferenceKey.USER_BOUGHT_IDEAS));

        (boughtIdeas[key] as BoughtIdea) = {
            ...(boughtIdeas[key]) || {},
            stallName: buyIdeaRequest.details.stallName,
            ideaName: buyIdeaRequest.details.ideaName,
            desc: buyIdeaRequest.details.desc,
            purchased: true
        };

        localStorage.setItem(PreferenceKey.USER_BOUGHT_IDEAS, JSON.stringify(boughtIdeas));

        this.boughtIdeas$.next(boughtIdeas);

        return;
    }

    public async giveFeedbackIdea(feedbackRequest: FeedbackRequest): Promise<undefined> {
        const url = this.appConfig.baseUrl + StallServicesImpl.GIVE_FEEDBACK_ENDPOINT;

        const body = {
            id: 'open-saber.registry.create',
            request: {
                Vote: {
                    rating: feedbackRequest.details.rating,
                    comment: feedbackRequest.details.comment,
                    ideaCode: feedbackRequest.ideaCode,
                    visitorCode: await this.appPreferences.fetch(PreferenceKey.USER_CODE)
                }
            }
        };

        await this.apiHandler.handle(url, body);

        const key = `${feedbackRequest.stallCode}-${feedbackRequest.ideaCode}`;

        const boughtIdeas: BoughtIdeas = JSON.parse(localStorage.getItem(PreferenceKey.USER_BOUGHT_IDEAS));

        (boughtIdeas[key] as BoughtIdea) = {
            ...(boughtIdeas[key]) || {},
            stallName: feedbackRequest.details.stallName,
            ideaName: feedbackRequest.details.ideaName,
            desc: feedbackRequest.details.desc,
            rating: feedbackRequest.details.rating,
            comment: feedbackRequest.details.comment
        };

        localStorage.setItem(PreferenceKey.USER_BOUGHT_IDEAS, JSON.stringify(boughtIdeas));

        this.boughtIdeas$.next(boughtIdeas);

        return;
    }

    public getBoughtIdeas(): Observable<BoughtIdeas> {
        return this.boughtIdeas$;
    }
}
