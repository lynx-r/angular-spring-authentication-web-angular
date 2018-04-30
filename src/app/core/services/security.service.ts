import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppConstants} from '../config/app-constants';
import {RegisterUser} from '../../auth/models/register-user';
import {ApiSecurityService} from './api-security.service';
import {of} from 'rxjs/observable/of';
import {AuthUser} from '../../auth/models/auth-user';

@Injectable()
export class SecurityService {
  constructor(
    private apiSecurityService: ApiSecurityService
  ) {
  }

  register(
    registerUser: RegisterUser
  ): Observable<AuthUser> {
    return this.apiSecurityService
      .post(AppConstants.REGISTER_RESOURCE, registerUser)
  }

  authorize(
    registerUser: RegisterUser
  ): Observable<AuthUser> {
    return this.apiSecurityService
      .post(AppConstants.AUTHORIZE_RESOURCE, registerUser)
  }

  authenticate(
    authUser: AuthUser | null
  ): Observable<AuthUser> {
    if (authUser == null) {
      return of(<AuthUser>{
        type: AppConstants.AUTH_USER_PAYLOAD_CLASS,
        roles: [AppConstants.ANONYMOUS_ROLE]
      });
    }
    return this.apiSecurityService
      .post(AppConstants.AUTHENTICATE_RESOURCE, authUser)
  }

  logout(authUser: AuthUser) {
    return this.apiSecurityService
      .post(AppConstants.LOGOUT_RESOURCE, authUser)
  }
}
