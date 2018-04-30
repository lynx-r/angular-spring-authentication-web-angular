import {AppConstants} from '../../core/config/app-constants';

export class AuthUser {
  type = AppConstants.AUTH_USER_PAYLOAD_CLASS;
  username: string;
  accessToken: string;
  userSession: string;
  authorities: [string];
}
