import { TestBed, inject } from '@angular/core/testing';
import {SecurityService} from './security.service';
import {ServicesModule} from './services.module';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {reducers} from '../../auth/reducers';
import {AuthService} from './auth.service';
import {UserCredentials} from '../../auth/models/user-credentials';

describe('SecurityService', () => {
  let authService: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ServicesModule,
        StoreModule.forRoot({
          ...reducers,
          'feature': combineReducers(reducers)
        }),
      ]
    });
  });

  it('should be created', inject([SecurityService], (service: SecurityService) => {
    expect(service).toBeTruthy();
  }));

  it('should register user', inject([SecurityService], (service: SecurityService) => {
    let credentials = new UserCredentials();
    credentials.username = 'test';
    credentials.password = 'пароль';

    service.register(credentials)
      .subscribe(authUser =>
        expect(authUser.accessToken).toBeDefined(),
        fail
      );
  }));
});
