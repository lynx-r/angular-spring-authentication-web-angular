import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SecurityService} from './security.service';
import {catchError, map, take, tap} from 'rxjs/operators';
import {CookiesService} from './cookies.service';
import {getUserState} from '../../auth/reducers';
import {Store} from '@ngrx/store';
import {RootState} from '../reducers/reducer.reducer';
import {Utils} from './utils';

@Injectable()
export class AuthService {

  constructor(
    private securityService: SecurityService,
    private cookieService: CookiesService,
    private store: Store<RootState>
  ) {
  }

  authenticate() {
    const authUser = this.cookieService.getAuthUser();
    return this.securityService.authenticate(authUser);
  }

  logout() {
    return this.securityService.logout()
      .pipe(
        tap(() => this.cookieService.removeAuthUser()),
        catchError((error) => {
          this.cookieService.removeAuthUser();
          return Observable.of(error);
        })
      );
  }

  isLoggedIn() {
    return this.getLoggedUser().map(authUser => Utils.isLoggedIn(authUser));
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
      );
  }
}
