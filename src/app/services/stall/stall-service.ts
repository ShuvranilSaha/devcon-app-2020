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

export interface StallService {
    getStallList(): Promise<Stall[]>;

    getIdeaList(): Promise<Idea[]>;

    getUserAwardedPoints(eq: string): Observable<number>;

    getUserAwardedCertifications(): Observable<undefined>;

    postUserFeedback(request: { rating: 20 | 40 | 60 | 80 | 100, comment: string }): Observable<undefined>;
}

