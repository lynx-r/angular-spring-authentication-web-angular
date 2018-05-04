import * as config from '../config/config.json';
import {profile} from '../config/profile';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../models/answer';
import {Injectable} from '@angular/core';
import {catchError, map, take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {Authenticated, Failure} from '../../auth/actions/auth';
import {AuthUser} from '../../auth/models/auth-user';
import {CookiesService} from './cookies.service';
import {Store} from '@ngrx/store';
import {RootState} from '../reducers/reducer.reducer';

@Injectable()
export class ApiBase {

  constructor(private http: HttpClient,
              private cookieService: CookiesService,
              private store: Store<RootState>
  ) {
  }

  protected httpPost<T>(resource: string, config: {}, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.post(resource, config, options)
      .pipe(
        tap((answer: Answer) => this.setAuthUserState(answer.authUser)),
        map((answer: Answer) => answer.body),
        catchError(error => {
          return Observable.throw(new Failure(error.error.message.message));
        }),
        take(1)
      )
  }

  protected httpGet<T>(resource: string, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.get(resource, options)
      .pipe(
        tap((answer: Answer) => this.setAuthUserState(answer.authUser)),
        map((answer: Answer) => answer.body),
        catchError(error => {
          return Observable.throw(new Failure(error.error.message.message));
        }),
        take(1)
      )
  }

  /**
   * Не private для тестов
   * @returns {any}
   */
  static apiSecurityUrl() {
    return ApiBase.getConfig().api_security_url;
  }

  /**
   * Не private для тестов
   * @returns {any}
   */
  static apiPingUrl() {
    return ApiBase.getConfig().api_ping_url;
  }

  private static commonOptions(options?: {}) {
    if (options == null) {
      options = {};
    }
    options = {
      ...options,
      withCredentials: true
    };
    return options;
  }

  private static getConfig() {
    return (<any>config)[profile];
  }

  private setAuthUserState(authUser: AuthUser) {
    this.cookieService.putAuthUser(authUser);
    this.store.dispatch(new Authenticated(authUser));
  }
}
