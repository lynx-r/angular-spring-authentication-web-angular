import {AppConstants} from '../../core/config/app-constants';

export class UserCredentials {
  // обязательно для десериализации на сервере
  type = AppConstants.REGISTER_USER_PAYLOAD_CLASS;
  username: string;
  password: string;
}
