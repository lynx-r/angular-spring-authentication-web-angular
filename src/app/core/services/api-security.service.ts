import {Injectable} from '@angular/core';
import {ApiBase} from './api-base';
import {Observable} from 'rxjs/Observable';
import {AuthUser} from '../../auth/models/auth-user';
import {map, tap} from 'rxjs/operators';
import {Answer} from '../models/answer';
import {Authenticated} from '../../auth/actions/auth';

@Injectable()
export class ApiSecurityService extends ApiBase {

  get<T>(resource: string): Observable<T> {
    return super
      .httpGet<T>(ApiBase.apiSecurityUrl() + resource)
  }

  post<T>(resource: string, config: any): Observable<T> {
    return super
      .httpPost<T>(ApiBase.apiSecurityUrl() + resource, config)
  }
}
