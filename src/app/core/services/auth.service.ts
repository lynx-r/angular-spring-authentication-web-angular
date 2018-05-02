import {Injectable} from '@angular/core';
import {UserCredentials} from '../../auth/models/user-credentials';
import {Observable} from 'rxjs/Observable';
import {SecurityService} from './security.service';
import {Store} from '@ngrx/store';
import {RootState} from '../reducers/reducer.reducer';
import {catchError, map, take, tap} from 'rxjs/operators';
import {ErrorHandlingService} from './error-handling.service';
import {Authenticated, Failure} from '../../auth/actions/auth';
import {CookiesService} from './cookies.service';
import {AuthUser} from '../../auth/models/auth-user';
import {getLoggedInState, getUserState} from '../../auth/reducers';

@Injectable()
export class AuthService {

  constructor(
    private securityService: SecurityService,
    private cookieService: CookiesService,
    private store: Store<RootState>,
    private errorHandler: ErrorHandlingService
  ) {
  }

  register(credentials: UserCredentials): Observable<AuthUser | Failure> {
    return this.securityService.register(credentials)
      .pipe(
        tap(authUser => this.setAuthUserState(authUser)),
        catchError(error =>
          ErrorHandlingService.handleAuthError(error)
        )
      )
  }

  authorize(credentials: UserCredentials): Observable<AuthUser | Failure> {
    return this.securityService.authorize(credentials)
      .pipe(
        tap(authUser => this.setAuthUserState(authUser)),
        catchError(error => {
          return ErrorHandlingService.handleAuthError(error);
        })
      )
  }

  authenticate() {
    let authUser = this.cookieService.getAuthUser();
    return this.securityService.authenticate(authUser)
      .pipe(
        tap(authedUser => this.setAuthUserState(authedUser)),
        catchError(error => {
          return ErrorHandlingService.handleAuthError(error);
        })
      )
  }

  logout() {
    return this.securityService.logout()
      .pipe(
        tap(() => this.cookieService.removeAuthUser()),
        catchError(error => {
          return ErrorHandlingService.handleAuthError(error);
        })
      )
      ;
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

  setAuthUserState(authUser: AuthUser) {
    this.cookieService.putAuthUser(authUser);
    this.store.dispatch(new Authenticated(authUser));
  }
}
