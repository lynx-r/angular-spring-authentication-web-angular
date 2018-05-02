import * as config from '../config/config.json';
import {profile} from '../config/profile';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Answer} from '../models/answer';
import {Injectable} from '@angular/core';
import {RootState} from '../reducers/reducer.reducer';
import {Store} from '@ngrx/store';
import {Authenticated, Failure} from '../../auth/actions/auth';
import {catchError, map, take} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ApiBase {

  constructor(private http: HttpClient,
              private store: Store<RootState>,
  ) {
  }

  protected httpPost<T>(resource: string, config: {}, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.post(resource, config, options)
      .pipe(
        map((resp: HttpResponse<Answer>) => {
          return this.processRequest(resp);
        }),
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
        map((resp: HttpResponse<Answer>) => {
          return this.processRequest(resp);
        }),
        catchError(error => {
          return Observable.throw(new Failure(error.error.message.message));
        }),
        take(1)
      )
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

  static apiSecurityUrl() {
    return ApiBase.getConfig().api_security_url;
  }

  static apiDefendedUrl() {
    return ApiBase.getConfig().api_defended_url;
  }

  protected processRequest(resp: HttpResponse<Answer>) {
    let body = resp.body;
    this.store.dispatch(new Authenticated(body.authUser));
    return body.body;
  }

  private static getConfig() {
    return (<any>config)[profile];
  }
}
