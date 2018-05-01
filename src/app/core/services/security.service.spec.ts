import {TestBed, inject} from '@angular/core/testing';
import {SecurityService} from './security.service';
import {ServicesModule} from './services.module';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {reducers} from '../../auth/reducers';
import {AuthService} from './auth.service';
import {UserCredentials} from '../../auth/models/user-credentials';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AppConstants} from '../config/app-constants';
import {ApiBase} from './api-base';

describe('SecurityService', () => {
  let mockCredentials = {
    type: AppConstants.USER_CREDENTIALS_PAYLOAD_CLASS,
    username: 'alex.po',
    password: 'мой пароль'
  };
  let fakeAuthUser = {
    userId: 'я',
    username: 'пользователь',
    accessToken: '123',
    userSession: '123',
    authorities: ['USER']
  };
  let mockRegisterUserBody = {
    statusCode: 201,
    body: fakeAuthUser,
    authUser: fakeAuthUser
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ServicesModule,
        StoreModule.forRoot({
          ...reducers,
          'feature': combineReducers(reducers)
        }),
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject([SecurityService], (service: SecurityService) => {
    expect(service).toBeTruthy();
  }));

  it('should register user', inject([SecurityService, HttpTestingController], (service: SecurityService, backend: HttpTestingController) => {
    service.register(mockCredentials)
      .subscribe(authUser =>
          expect(authUser.accessToken).not.toBeNull(),
        fail
      );

    let mockReq = backend.expectOne(ApiBase.apiSecurityUrl() + AppConstants.REGISTER_RESOURCE);

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockRegisterUserBody);

    backend.verify();
  }));
});
