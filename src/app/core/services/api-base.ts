import * as config from '../config/config.json';
import {profile} from '../config/profile';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Answer} from '../models/answer';
import {Injectable} from '@angular/core';
import {RootState} from '../reducers/reducer.reducer';
import {Store} from '@ngrx/store';
import {Authenticated} from '../../auth/actions/auth';

@Injectable()
export class ApiBase {

  constructor(private http: HttpClient,
              private store: Store<RootState>,
  ) {
  }

  protected httpPost<T>(resource: string, config: {}, options?: {}) {
    options = ApiBase.commonOptions(options);
    return this.http.post(resource, config, options)
      .map((resp: HttpResponse<Answer>) => {
        return this.processRequest(resp);
      })
      .take(1)
  }

  private static commonOptions(options?: {}) {
    if (options == null) {
      options = {};
    }
    options = {
      ...options,
      observe: 'response',
      withCredentials: true
    };
    return options;
  }

  protected static apiSecurityUrl() {
    return ApiBase.getConfig().api_security_url;
  }

  protected static apiSecuredUrl() {
    return ApiBase.getConfig().api_secured_url;
  }

  protected processRequest(resp: HttpResponse<Answer>) {
    let body = resp.body;
    if (!!body) {
      if (body.statusCode == 200 || body.statusCode == 201) {
        this.store.dispatch(new Authenticated(body.authUser));
        return body.body;
      } else {
        throw body.message
      }
    } else {
      return false;
    }
  }

  private static getConfig() {
    return (<any>config)[profile];
  }
}
