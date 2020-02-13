import {CreateUserRequest, GetUserRequest, UpdateUserRequest} from './requests';
import {CreateUserResponse, GetUserResponse, UpdateUserResponse} from './response';

export interface UserService {
    createUser(createUserRequest: CreateUserRequest): Promise<CreateUserResponse>;

    getUser(getUserRequest: GetUserRequest): Promise<GetUserResponse>;

    updateUserProfile(updatedUserRequest: UpdateUserRequest): Promise<UpdateUserResponse>;
}
