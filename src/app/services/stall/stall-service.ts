import { Observable } from 'rxjs';

export interface Stall {
    code: string;
    osCreatedAt: string;
    type: string;
    name: string;
    osid: string;
    ideas?: Idea[];
}

export interface Idea {
    code: string;
    osCreatedAt: string;
    '@type': string;
    name: string;
    description: string;
    osid: string;
    stallCode: string;
}

export interface VisitorActivity {
    osCreatedAt: string;
    '@type': string;
    rating: number;
    comment: string;
    osid: string;
    visitorCode: string;
    ideaCode: string;
    timestamp: string;
    points: number;
}

export interface StallService {
    getStallList(): Promise<Stall[]>;

    getIdeaList(): Promise<Idea[]>;

    getUserAwardedPoints(): Observable<number>;

    // getUserAwardedCertifications(): Observable<undefined>;

    // postUserFeedback(request: { points: 20 | 40 | 60 | 80 | 100, comment: string,  ideaCode: string}): Observable<string>;
}

