import {AppConstants} from '../../core/config/app-constants';

export class RegisterUser {
  type = AppConstants.REGISTER_USER_PAYLOAD_CLASS;
  username: string;
  password: string;
}
