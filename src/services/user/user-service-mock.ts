import {UserService} from './user.service';
import {CreateUserResponse, GetUserResponse, UpdateUserResponse} from './response';
import {CreateUserRequest, GetUserRequest, UpdateUserRequest} from './requests';
import {Injectable} from '@angular/core';

@Injectable()
export class UserServiceMock implements UserService {
    public async createUser(createUserRequest: CreateUserRequest): Promise<CreateUserResponse> {
        return {
            Visitor: {
                code: 'SAMPLE_CODE'
            }
        };
    }

    public async getUser(getUserRequest: GetUserRequest): Promise<GetUserResponse> {
        return {
            Visitor: {
                code: 'SAMPLE_CODE',
                org: 'SAMPLE_ORG',
                name: 'SAMPLE_NAME'
            }
        };
    }

    public async updateUserProfile(updatedUserRequest: UpdateUserRequest): Promise<UpdateUserResponse> {
        return {
            Visitor: {
                code: 'SAMPLE_CODE'
            }
        };
    }
}
