import {AppConstants} from '../../core/config/app-constants';

export class AuthUser {
  type = AppConstants.AUTH_USER_PAYLOAD_CLASS;
  username: string;
  accessToken: string;
  userSession: string;
  roles: [string];
}

export class RegisterUser {
  type = AppConstants.REGISTER_USER_PAYLOAD_CLASS;
  username: string;
  password: string;
}
