import {Injectable} from '@angular/core';
import {ApiBase} from './api-base';
import {HttpHeaders} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';
import { retry} from 'rxjs/operators';
import {AppConstants} from '../config/app-constants';
import {AnswerMessage} from '../models/answer-message';

@Injectable()
export class ApiSecuredService extends ApiBase {

  post<T>(resource: string, config: any): Observable<T | AnswerMessage | boolean> {
    let headers = this.commonHeaders();
    return super
      .httpPost<T>(this.apiSecuredUrl() + resource, config, {
        headers: headers,
      })
      .pipe(
        retry(AppConstants.HTTP_RETRY)
      )
  }

  private commonHeaders() {
    let headers = new HttpHeaders();
    headers.append(AppConstants.REQUESTED_API, AppConstants.API_ARTICLE);
    return headers;
  }
}
