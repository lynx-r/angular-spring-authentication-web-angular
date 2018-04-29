import {AppConstants} from '../../core/config/app-constants';

export interface AttributeValue {
  [key: string]: string
}

export interface AttributeValues {
  [key: string]: AttributeValue
}

export class AuthUser {
  type = AppConstants.AUTH_USER_PAYLOAD_CLASS;
  username: string;
  accessToken: string;
  userSession: string;
  counter: number;
  roles: [string];
  filterExpression: string = "";
  filterValues: AttributeValues;
}

export class RegisterUser {
  type = AppConstants.REGISTER_USER_PAYLOAD_CLASS;
  username: string;
  password: string;
}
