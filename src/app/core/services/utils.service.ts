import {Injectable} from '@angular/core';
import {AppConstants} from '../config/app-constants';
import {AuthUser} from '../../auth/models/registerUser';
import {profile} from '../config/profile';

@Injectable()
export class UtilsService {

  tokenize(s: string, parsers: { [key: string]: RegExp }, deftok: string) {
    let m, r, t, tokens = [];
    while (s) {
      t = null;
      m = s.length;
      for (let key in parsers) {
        r = parsers[key].exec(s);
        // try to choose the best match if there are several
        // where "best" is the closest to the current starting point
        if (r && (r.index < m)) {
          t = {
            token: r[0],
            type: key,
            matches: r.slice(1)
          };
          m = r.index;
        }
      }
      if (m) {
        // there is text between last token and currently
        // matched token - push that out as default or "unknown"
        tokens.push({
          token: s.substr(0, m),
          type: deftok || 'unknown'
        });
      }
      if (t) {
        // push current token onto sequence
        tokens.push(t);
      }
      s = s.substr(m + (t ? t.token.length : 0));
    }
    return tokens;
  }

  isDevProfile() {
    return profile == 'dev';
  }

  isProdProfile() {
    return profile == 'prod';
  }

  static isLoggedIn(authUser: AuthUser | null) {
    return !!authUser && !(authUser.roles
      .indexOf(AppConstants.ANONYMOUS_ROLE) > -1);
  }

  static removeItem(sKey: string, sPath?: string, sDomain?: string) {
    document.cookie = encodeURIComponent(sKey) +
      "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "");
  }
}
