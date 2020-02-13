export interface GetStallsRequest {
    Stall: any
}

export interface GetIdeasRequest {
    code: string
}

export interface BuyIdeaRequest {
    stallCode: string;
    ideaCode: string;
    details: {
        stallName: string;
        ideaName: string;
        desc: string;
    }
}

export interface FeedbackRequest {
    stallCode: string;
    ideaCode: string;
    details: {
        stallName: string;
        ideaName: string;
        desc: string;
        rating: number;
        comment: string;
    };
}
