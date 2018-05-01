import {AppConstants} from '../../core/config/app-constants';

export class UserCredentials {
  // обязательно для десериализации на сервере
  type = AppConstants.USER_CREDENTIALS_PAYLOAD_CLASS;
  username: string;
  password: string;
}
