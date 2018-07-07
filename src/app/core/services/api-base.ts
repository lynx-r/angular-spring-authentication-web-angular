import * as configuration from '../config/config.json';
import {profile} from '../config/profile';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../models/answer';
import {Injectable} from '@angular/core';
import {catchError, map, retry, take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {Authenticated, Failure} from '../../auth/actions/auth';
import {AuthUser} from '../../auth/models/auth-user';
import {CookiesService} from './cookies.service';
import {Store} from '@ngrx/store';
import {RootState} from '../reducers/reducer.reducer';
import {AppConstants} from '../config/app-constants';
import {ErrorHandlingService} from './error-handlingservice';

@Injectable()
export class ApiBase {
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
    return (<any>configuration)[profile];
  }

  constructor(private http: HttpClient,
              private cookieService: CookiesService,
              private store: Store<RootState>,
              private errorHandler: ErrorHandlingService
  ) {
  }

  protected httpPost<T>(resource: string, config: any, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.post(resource, config, options)
      .pipe(this.processResponse<T>());
  }

  protected httpDelete<T>(resource: string, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.delete(resource, options)
      .pipe(this.processResponse<T>());
  }

  protected httpGet<T>(resource: string, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.get(resource, options)
      .pipe(this.processResponse<T>());
  }

  protected httpRemove<T>(resource: string, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.delete(resource, options)
      .pipe(this.processResponse<T>());
  }

  protected httpPut<T>(resource: string, config: any, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.put(resource, config, options)
      .pipe(this.processResponse<T>());
  }

  private processResponse<T>() {
    // notice that we return a function here
    return (source: Observable<Answer>): Observable<T> => {
      return Observable.create((subscriber: any) => {
        return source.pipe(
          tap((answer: Answer) => this.setAuthUserState(answer.authUser)),
          map((answer: Answer) => {
            return answer.body;
          }),
          retry(AppConstants.HTTP_RETRY),
          catchError(error => {
            if (!!error.message && error.message === 'answer is null') {
              return this.errorHandler.handleError(error);
            } else {
              return this.errorHandler.handleAuthError(error);
            }
          }),
          take(1)
        ).subscribe(
          value => subscriber.next(value),
          (error: Observable<Failure>) => subscriber.error(error),
          () => subscriber.complete());
      });
    };
  }

  private setAuthUserState(authUser: AuthUser) {
    this.cookieService.putAuthUser(authUser);
    this.store.dispatch(new Authenticated(authUser));
  }
}
