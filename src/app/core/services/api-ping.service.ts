import {Injectable} from '@angular/core';
import {ApiBase} from './api-base';
import {Observable} from 'rxjs/Observable';
import {MessageResponse} from '../models/message-response';

@Injectable()
export class ApiPingService extends ApiBase {

  post<T>(resource: string, config: any): Observable<T | MessageResponse | boolean> {
    return super
      .httpPost<T>(ApiBase.apiPingUrl() + resource, config)
  }
}
