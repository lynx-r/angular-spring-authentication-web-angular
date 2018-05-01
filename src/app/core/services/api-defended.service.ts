import {Injectable} from '@angular/core';
import {ApiBase} from './api-base';
import {Observable} from 'rxjs/Observable';
import { retry} from 'rxjs/operators';
import {AppConstants} from '../config/app-constants';
import {AnswerMessage} from '../models/answer-message';

@Injectable()
export class ApiDefendedService extends ApiBase {

  post<T>(resource: string, config: any): Observable<T | AnswerMessage | boolean> {
    return super
      .httpPost<T>(ApiBase.apiDefendedUrl() + resource, config)
      .pipe(
        retry(AppConstants.HTTP_RETRY)
      )
  }
}
