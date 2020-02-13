import {BuyIdeaRequest, FeedbackRequest, GetIdeasRequest, GetStallsRequest} from './requests';
import {GetIdeasResponse} from './responses';
import {Stall} from './Stall';
import {BoughtIdeas} from './BoughtIdeas';
import {Observable} from 'rxjs';


export interface StallService {
    getStalls(getStallsRequest: GetStallsRequest): Promise<Stall[]>;

    getIdeas(getIdeasRequest: GetIdeasRequest): Promise<GetIdeasResponse>;

    giveFeedbackIdea(feedbackRequest: FeedbackRequest): Promise<undefined>;

    buyIdea(buyIdeaRequest: BuyIdeaRequest): Promise<undefined>;

    getBoughtIdeas(): Observable<BoughtIdeas>;
}
