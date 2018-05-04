import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppConstants} from '../config/app-constants';
import {UserCredentials} from '../../auth/models/user-credentials';
import {ApiSecurityService} from './api-security.service';
import {AuthUser} from '../../auth/models/auth-user';
import 'rxjs/add/observable/empty';

@Injectable()
export class SecurityService {
  constructor(
    private apiSecurityService: ApiSecurityService
  ) {
  }

  register(
    userCredentials: UserCredentials
  ): Observable<AuthUser> {
    return this.apiSecurityService
      .post(AppConstants.REGISTER_RESOURCE, userCredentials)
  }

  authorize(
    userCredentials: UserCredentials
  ): Observable<AuthUser> {
    return this.apiSecurityService
      .post(AppConstants.AUTHORIZE_RESOURCE, userCredentials)
  }

  authenticate(
    authUser: AuthUser | null
  ): Observable<AuthUser> {
    if (authUser == null) {
      return Observable.empty();
    }
    return this.apiSecurityService
      .post(AppConstants.AUTHENTICATE_RESOURCE, authUser)
  }

  logout() {
    return this.apiSecurityService
      .get(AppConstants.LOGOUT_RESOURCE)
  }
}
