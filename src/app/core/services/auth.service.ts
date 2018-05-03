import {Injectable} from '@angular/core';
import {UserCredentials} from '../../auth/models/user-credentials';
import {Observable} from 'rxjs/Observable';
import {SecurityService} from './security.service';
import {Store} from '@ngrx/store';
import {RootState} from '../reducers/reducer.reducer';
import { map, take, tap} from 'rxjs/operators';
import {Authenticated} from '../../auth/actions/auth';
import {CookiesService} from './cookies.service';
import {AuthUser} from '../../auth/models/auth-user';
import {getLoggedInState, getUserState} from '../../auth/reducers';
import {Answer} from '../models/answer';

@Injectable()
export class AuthService {

  constructor(
    private securityService: SecurityService,
    private cookieService: CookiesService,
    private store: Store<RootState>,
  ) {
  }

  register(credentials: UserCredentials): Observable<AuthUser> {
    return this.securityService.register(credentials)
      .pipe(
        map((answer: Answer) => answer.authUser),
        tap((authUser: AuthUser) => this.setAuthUserState(authUser))
      )
  }

  authorize(credentials: UserCredentials): Observable<AuthUser> {
    return this.securityService.authorize(credentials)
      .pipe(
        map((answer: Answer) => answer.authUser),
        tap((authUser: AuthUser) => this.setAuthUserState(authUser))
      )
  }

  authenticate() {
    let authUser = this.cookieService.getAuthUser();
    return this.securityService.authenticate(authUser)
      .pipe(
        map((answer: Answer) => answer.authUser),
        tap((authUser: AuthUser) => this.setAuthUserState(authUser))
      )
  }

  logout() {
    return this.securityService.logout()
      .pipe(
        tap(() => this.cookieService.removeAuthUser())
      )
  }

  isLoggedIn() {
    return this.store.select(getLoggedInState) as Observable<boolean>;
  }

  getLoggedUser() {
    return this.store.select(getUserState)
      .pipe(
        map(authUser => {
          if (!!authUser) {
            console.log('select',authUser);
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
