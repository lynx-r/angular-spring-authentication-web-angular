import {Injectable} from '@angular/core';
import {ApiBase} from './api-base';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ApiSecurityService extends ApiBase {

  post<T>(resource: string, config: any): Observable<T> {
    return super
      .httpPost<T>(this.apiSecurityUrl() + resource, config)
  }
}
