import * as config from '../config/config.json';
import {profile} from '../config/profile';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Answer} from '../models/answer';
import {Injectable} from '@angular/core';
import {CookiesService} from './cookies.service';
import {AuthUser} from '../../auth/models/registerUser';

@Injectable()
export class ApiBase {

  constructor(private http: HttpClient,
              private cookieService: CookiesService,
  ) {
  }

  protected httpPost<T>(resource: string, config: {}, options?: {}) {
    options = this.commonOptions(options);
    return this.http.post(resource, config, options)
      .map((resp: HttpResponse<Answer>) => {
        return this.processRequest(resp);
      })
      .take(1)
  }

  private commonOptions(options?: {}) {
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

  protected apiSecurityUrl() {
    return this.getConfig().api_security_url;
  }

  protected apiSecuredUrl() {
    return this.getConfig().api_secured_url;
  }

  protected processRequest(resp: HttpResponse<Answer>) {
    let body = resp.body;
    if (!!body) {
      if (body.statusCode == 200 || body.statusCode == 201) {
        let newAuthUser = body.authUser as AuthUser;
        let oldAuthUser = this.cookieService.getAuthUser();
        this.cookieService.replaceAuthUser(oldAuthUser, newAuthUser);
        return body.body;
      } else {
        throw body.message
      }
    } else {
      return false;
    }
  }

  private getConfig() {
    return (<any>config)[profile];
  }

  private processAnswer<T>(answer: Answer) {
    if ((answer.statusCode == 200) || (answer.statusCode == 201)) {
      return answer.body as T;
    }
    return answer.message;
  }

}
