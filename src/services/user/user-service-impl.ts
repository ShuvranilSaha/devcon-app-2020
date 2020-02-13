import {UserService} from './user.service';
import {CreateUserRequest, GetUserRequest, UpdateUserRequest} from './requests';
import {CreateUserResponse, GetUserResponse, UpdateUserResponse} from './response';
import {Inject, Injectable} from '@angular/core';
import {ApiHandlerService} from '../api/api-handler-service';
import {AppConfig} from '../../config/AppConfig';

@Injectable()
export class UserServiceImpl implements UserService {
    private static CREATE_USER_ENDPOINT = '/add';
    private static GET_USER_ENDPOINT = '/read-dev';
    private static UPDATE_USER_ENDPOINT = '/update';

    constructor(private apiHandler: ApiHandlerService,
                @Inject('APP_CONFIG') private appConfig: AppConfig) {
    }

    createUser(createUserRequest: CreateUserRequest): Promise<CreateUserResponse> {
        const url = this.appConfig.baseUrl + UserServiceImpl.CREATE_USER_ENDPOINT;

        const body = {
            id: 'open-saber.registry.create',
            request: createUserRequest
        };

        return this.apiHandler.handle(url, body);
    }

    getUser(getUserRequest: GetUserRequest): Promise<GetUserResponse> {
        const url = this.appConfig.baseUrl + UserServiceImpl.GET_USER_ENDPOINT

        const body = {
            id: 'open-saber.registry.read',
            request: getUserRequest
        };

        return this.apiHandler.handle(url, body);
    }

    updateUserProfile(updatedUserRequest: UpdateUserRequest): Promise<UpdateUserResponse> {
        const url = this.appConfig.baseUrl + UserServiceImpl.UPDATE_USER_ENDPOINT;

        const body = {
            id: 'open-saber.registry.update',
            request: updatedUserRequest
        };

        return this.apiHandler.handle(url, body);
    }
}