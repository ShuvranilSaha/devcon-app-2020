export interface CreateUserResponse {
    Visitor: {
        code: string;
        // osid: string;
    };
}

export interface GetUserResponse {
    Visitor: {
        code: string;
        org: string;
        name: string;
        // "osid": "5de5c14b-0681-42b3-9b27-ff8deeac4fbe"
    };
}

export interface UpdateUserResponse {
    Visitor: {
        code: string;
        // "osid": "0248b542-5e8a-4983-aeca-e3438926412e"
    };
}
