import {Injectable} from '@angular/core';
import {ApiBase} from './api-base';
import { HttpHeaders} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';
import {retry} from 'rxjs/operators';
import {AppConstants} from '../config/app-constants';

@Injectable()
export class ApiSecurityService extends ApiBase {

  get<T>(resource: string, headers: {[key: string]: string}): Observable<T> {
    let commonHeaders = this.commonHeaders();
    for (let h of Object.keys(headers)) {
      commonHeaders.append(h, headers[h]);
    }
    return super
      .httpGet<T>(this.apiSecurityUrl() + resource, {headers: headers})
  }

  post<T>(resource: string, config: any): Observable<T> {
    let headers = this.commonHeaders();
    return super
      .httpPost<T>(this.apiSecurityUrl() + resource, config, {
        headers: headers,
      })
  }

  private commonHeaders() {
    let headers = new HttpHeaders();
    headers.append(AppConstants.REQUESTED_API, AppConstants.API_ARTICLE);
    return headers;
  }
}
