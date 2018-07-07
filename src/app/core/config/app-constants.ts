export class AppConstants {

  static AUTH_REQUEST_RESOURCE = '/auth-request';
  static REGISTER_RESOURCE = '/register';
  static AUTHORIZE_RESOURCE = '/authorize';
  static AUTHENTICATE_RESOURCE = '/authenticate';
  static LOGOUT_RESOURCE = '/logout';

  static PING_RESOURCE = '/ping';

  static ANONYMOUS_ROLE = 'ANONYMOUS';

  static USER_SESSION_HEADER = 'user-session';
  static ACCESS_TOKEN_HEADER = 'access-token';

  static AUTH_USER_PAYLOAD_CLASS = 'AuthUser';
  static USER_CREDENTIALS_PAYLOAD_CLASS = 'UserCredentials';

  static AUTH_USER_COOKIE = 'auth-user';
  static HTTP_RETRY = 3;
  static FAIL_SERVER_CONNECTION = 'Не удалось установить соединение с сервером';
}
