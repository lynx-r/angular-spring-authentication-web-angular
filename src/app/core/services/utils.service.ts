import {AppConstants} from '../config/app-constants';
import {profile} from '../config/profile';

export class Utils {

  static isProdProfile() {
    return profile === 'prod';
  }

  static isLoggedIn(authUser) {
    return !!authUser
      && !(authUser.authorities
        .indexOf(AppConstants.ANONYMOUS_ROLE) > -1);
  }
}
