import {Idea} from './Idea';

export interface GetIdeasResponse {
    Stall: {
        code: string;
        ideas: Idea[]
        name: string;
    };
}
