import {Injectable} from '@angular/core';
import {CookieOptions, CookieService} from 'ngx-cookie';
import {
  NavigationStart,
  Router,
  RouterState,
  RouterStateSnapshot
} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {AuthUser} from '../../auth/models/registerUser';
import {UtilsService} from './utils.service';
import {AppConstants} from '../config/app-constants';

@Injectable()
export class CookiesService {

  private static SEP = '-';
  private prefix: string;

  constructor(
    private cookieService: CookieService,
    private utils: UtilsService,
    private router: Router
  ) {
    router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        map((nav: NavigationStart) => nav.url),
      )
      .subscribe((id) =>
        this.prefix = this.formatPrefix(id.toString())
      );
    const state: RouterState = router.routerState;
    const snapshot: RouterStateSnapshot = state.snapshot;
    this.prefix = this.formatPrefix(snapshot.url);
  }

  get(key: string) {
    return this.cookieService.get(key + this.prefix);
  }

  put(key: string, val: any) {
    this.cookieService.put(key + this.prefix, val);
  }

  getPref(prefix: string, key: string) {
    return this.cookieService.get(prefix + key);
  }

  putPref(prefix: string, key: string, val: any) {
    this.cookieService.put(prefix + key, val);
  }

  getObject(key: string) {
    return this.cookieService.getObject(key + this.prefix);
  }

  putObject(key: string, val: any) {
    this.cookieService.putObject(key + this.prefix, val);
  }

  getObjectPref(prefix: string, key: string) {
    return this.cookieService.getObject(prefix + key);
  }

  putObjectPref(prefix: string, key: string, val: any) {
    return this.cookieService.putObject(prefix + key, val);
  }

  getAuthUser() {
    return this.cookieService.getObject(AppConstants.AUTH_USER_COOKIE) as AuthUser;
  }

  putAuthUser(authUser: AuthUser) {
    let authUserOld = this.getAuthUser();
    if (!authUserOld || !!authUser && authUserOld.accessToken != authUser.accessToken) {
      this.cookieService.remove(AppConstants.AUTH_USER_COOKIE);
      let options: CookieOptions = {
        expires: new Date(Date.now() + (1000 * 60 * 60)),
      };
      if (this.utils.isProdProfile()) {
        options = {
          ...options,
          secure: true,
        }
      }
      this.cookieService.putObject(AppConstants.AUTH_USER_COOKIE, authUser, options);
    }
  }

  replaceAuthUser(oldAuthUser: AuthUser, newAuthUser: AuthUser) {
    if (!!oldAuthUser && !!newAuthUser) {
      if (newAuthUser.counter > oldAuthUser.counter) {
        this.putAuthUser(newAuthUser);
      }
    } else {
      this.putAuthUser(newAuthUser);
    }
  }

  removeOnPath(key: string, path: string) {
    this.cookieService.remove(key, {
      path: path
    });
  }

  removeAuthUser() {
    this.cookieService.remove(AppConstants.AUTH_USER_COOKIE);
  }

  private formatPrefix(prefix: string) {
    return prefix + CookiesService.SEP;
  }
}
