import {Injectable} from '@angular/core';
import {CookieOptions, CookieService} from 'ngx-cookie';
import {Utils} from './utils.service';
import {AppConstants} from '../config/app-constants';
import {AuthUser} from '../../auth/models/auth-user';

@Injectable()
export class CookiesService {

  constructor(
    private cookieService: CookieService
  ) {
  }

  get(key: string) {
    return this.cookieService.get(key);
  }

  put(key: string, val: any) {
    this.cookieService.put(key, val);
  }

  getAuthUser() {
    return this.cookieService.getObject(AppConstants.AUTH_USER_COOKIE) as AuthUser;
  }

  putAuthUser(authUser: AuthUser) {
    let authUserOld = this.getAuthUser();
    if (!authUserOld || !!authUser && authUserOld.accessToken != authUser.accessToken) {
      this.cookieService.remove(AppConstants.AUTH_USER_COOKIE);
      let options: CookieOptions = {};
      if (Utils.isProdProfile()) {
        options = {
          ...options,
          secure: true,
        }
      }
      this.cookieService.putObject(AppConstants.AUTH_USER_COOKIE, authUser, options);
    }
  }

  removeAuthUser() {
    this.cookieService.remove(AppConstants.AUTH_USER_COOKIE);
  }
}
