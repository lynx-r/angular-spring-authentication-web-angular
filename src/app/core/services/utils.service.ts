import {Injectable} from '@angular/core';
import {AppConstants} from '../config/app-constants';
import {profile} from '../config/profile';
import {AuthUser} from '../../auth/models/auth-user';

@Injectable()
export class UtilsService {

  static isProdProfile() {
    return profile == 'prod';
  }

  static isLoggedIn(authUser: AuthUser | null) {
    return !!authUser && !(authUser.authorities
      .indexOf(AppConstants.ANONYMOUS_ROLE) > -1);
  }
}
