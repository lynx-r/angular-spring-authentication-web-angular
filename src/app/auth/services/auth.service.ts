import {Injectable} from '@angular/core';
import {RegisterUser} from '../models/register-user';
import {Observable} from 'rxjs/Observable';
import {SecurityService} from '../../core/services/security.service';
import {getLoggedInState, getUserState} from '../reducers';
import {Store} from '@ngrx/store';
import {RootState} from '../../core/reducers/reducer.reducer';
import {catchError, map, take, tap} from 'rxjs/operators';
import {ErrorHandlingService} from '../../core/services/error-handling.service';
import {Authenticated, Failure} from '../actions/auth';
import {CookiesService} from '../../core/services/cookies.service';
import {AuthUser} from '../models/auth-user';

@Injectable()
export class AuthService {

  constructor(
    private securityService: SecurityService,
    private cookieService: CookiesService,
    private store: Store<RootState>,
    private errorHandler: ErrorHandlingService
  ) {
  }

  register(credentials: RegisterUser): Observable<AuthUser | Failure> {
    return this.securityService.register(credentials)
      .pipe(
        tap(authUser => this.setLoginState(authUser)),
        catchError(error =>
          this.errorHandler.handleAuthError(error)
        )
      )
  }

  authorize(credentials: RegisterUser): Observable<AuthUser | Failure> {
    return this.securityService.authorize(credentials)
      .pipe(
        tap(authUser => this.setLoginState(authUser)),
        catchError(error => {
          return this.errorHandler.handleAuthError(error);
        })
      )
  }

  authenticate() {
    let authUser = this.cookieService.getAuthUser();
    return this.securityService.authenticate(authUser)
      .pipe(
        tap(authedUser => this.setLoginState(authedUser)),
        catchError(error => {
          return this.errorHandler.handleAuthError(error);
        })
      )
  }

  logout() {
    let authUser = this.cookieService.getAuthUser();
    this.cookieService.removeAuthUser();
    return this.securityService.logout(authUser)
      .pipe(
        catchError(error => {
          return this.errorHandler.handleAuthError(error);
        })
      );
  }

  isLoggedIn() {
    return this.store.select(getLoggedInState) as Observable<boolean>;
  }

  getLoggedUser() {
    return this.store.select(getUserState)
      .pipe(
        map(authUser => {
          if (!!authUser) {
            return authUser;
          }
          return this.cookieService.getAuthUser();
        }),
        take(1)
      )
  }

  private setLoginState(authUser: AuthUser) {
    this.cookieService.putAuthUser(authUser);
    this.store.dispatch(new Authenticated(authUser));
  }
}
