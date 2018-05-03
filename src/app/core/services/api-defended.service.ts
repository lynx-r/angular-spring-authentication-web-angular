import {Injectable} from '@angular/core';
import {ApiBase} from './api-base';
import {Observable} from 'rxjs/Observable';
import { retry} from 'rxjs/operators';
import {AppConstants} from '../config/app-constants';
import {MessageResponse} from '../models/message-response';

@Injectable()
export class ApiDefendedService extends ApiBase {

  post<T>(resource: string, config: any): Observable<T | MessageResponse | boolean> {
    return super
      .httpPost<T>(ApiBase.apiDefendedUrl() + resource, config)
  }
}
