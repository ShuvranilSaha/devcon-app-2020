export interface BoughtIdeas {
    [key: string]: BoughtIdea | undefined;
}

export interface BoughtIdea {
    stallName: string;
    ideaName: string;
    desc: string;
    purchased?: boolean;
    rating?: number;
    comment?: string;
}
