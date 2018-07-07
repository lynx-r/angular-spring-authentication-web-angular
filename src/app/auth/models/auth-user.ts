import {AppConstants} from '../../core/config/app-constants';

export class AuthUser {
  type = AppConstants.AUTH_USER_PAYLOAD_CLASS;
  email: string;
  accessToken: string;
  userSession: string;
  salt: string;
  cost: number;
  misc: number;
  authorities: [string];
}
