export class AppConstants {

  static REGISTER_RESOURCE: string = '/register';
  static AUTHORIZE_RESOURCE: string = '/authorize';
  static AUTHENTICATE_RESOURCE: string = '/authenticate';
  static LOGOUT_RESOURCE: string = '/logout';

  static PING_RESOURCE: string = '/ping';
  static HTTP_RETRY: number = 0;
  static USER_SESSION_HEADER: string = 'user-session';
  static USER_ROLES_HEADER: string = 'user-authorities';
  static ANONYMOUS_ROLE: string = 'ANONYMOUS';
  static ACCESS_TOKEN_HEADER: string = 'access-token';
  static AUTH_USER_PAYLOAD_CLASS: string = 'AuthUser';
  static REGISTER_USER_PAYLOAD_CLASS: string = 'UserCredentials';
  static AUTH_USER_COOKIE: string = 'auth-user';
}
