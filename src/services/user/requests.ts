export interface CreateUserRequest {
    Visitor: {
        name: string
        org: string
        // nCoinsGiven: number
    };
}

export interface GetUserRequest {
    code: string;
}

export interface UpdateUserRequest {
    Visitor: {
        code: string;
        name: string;
        org: string
        // nCoinsGiven: string;
    };
}
