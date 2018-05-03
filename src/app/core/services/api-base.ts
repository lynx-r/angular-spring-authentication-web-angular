import * as config from '../config/config.json';
import {profile} from '../config/profile';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../models/answer';
import {Injectable} from '@angular/core';
import {catchError, map, take} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {Failure} from '../../auth/actions/auth';

@Injectable()
export class ApiBase {

  constructor(private http: HttpClient) {
  }

  protected httpPost<T>(resource: string, config: {}, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.post(resource, config, options)
      .pipe(
        map((answer: Answer) => {
          return answer;
        }),
        catchError(error => {
          console.log('error',error);
          return Observable.throw(new Failure(error.error.message.message));
        }),
        take(1)
      )
  }

  protected httpGet<T>(resource: string, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.get(resource, options)
      .pipe(
        map((answer: Answer) => {
          return answer;
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

  private static getConfig() {
    return (<any>config)[profile];
  }
}
