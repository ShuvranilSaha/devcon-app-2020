import { StallService } from './stall-service';
import { GetIdeasResponse } from './responses';
import { BuyIdeaRequest, FeedbackRequest, GetIdeasRequest, GetStallsRequest } from './requests';
import { Stall } from './Stall';
import { Injectable } from '@angular/core';
import { BoughtIdea, BoughtIdeas } from './BoughtIdeas';
import { PreferenceKey } from '../../config/constants';
import { Observable } from 'rxjs';

@Injectable()
export class StallServiceMock implements StallService {
    public async getStalls(getStallsRequest: GetStallsRequest): Promise<Stall[]> {
        return [
            {
                code: 'STA1',
                name: 'Creation'
            },
            {
                code: 'STA2',
                name: 'Classroom'
            }
        ];
    }

    public async getIdeas(getIdeasRequest: GetIdeasRequest): Promise<GetIdeasResponse> {
        if (getIdeasRequest.code === 'STA1') {
            return {
                Stall: {
                    code: 'STA1',
                    ideas: [
                        {
                            code: 'IDE1',
                            name: 'handwriting-recognition',
                            description: 'Allow participants to write',
                        },
                        {
                            code: 'IDE2',
                            name: 'teacher-aid',
                            description: 'Allow teachers to quickly create contents',
                        }
                    ],
                    name: 'Creation'
                }
            };
        } else {
            return {
                Stall: {
                    code: 'STA2',
                    ideas: [
                        {
                            code: 'IDE3',
                            name: 'some_classroom_name',
                            description: 'some_classroom_description',
                        },
                        {
                            code: 'IDE4',
                            name: 'some_classroom_name_1',
                            description: 'some_classroom_description_1',
                        }
                    ],
                    name: 'Classroom'
                }
            };
        }
    }

    public async buyIdea(buyIdeaRequest: BuyIdeaRequest): Promise<undefined> {
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

        return;
    }

    public async giveFeedbackIdea(feedbackRequest: FeedbackRequest): Promise<undefined> {
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

        return;
    }

    public getBoughtIdeas(): Observable<BoughtIdeas> {
        throw new Error('No implementation');
    }
}
