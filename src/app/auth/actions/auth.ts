import {Action} from '@ngrx/store';
import {UserCredentials} from '../models/user-credentials';
import {AuthUser} from '../models/auth-user';

export enum AuthActionTypes {
  REGISTER = '[Auth] Register',
  REGISTER_SUCCESS = '[Auth] Register Success',

  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_REDIRECT = '[Auth] Login Redirect',

  AUTHENTICATED = '[Auth] Authenticated',

  LOGOUT = '[Auth] Logout',
  LOGOUT_SUCCESS = '[Auth] Logout Success',

  FAILURE = '[Auth] Failure',
}

export class Register implements Action {
  readonly type = AuthActionTypes.REGISTER;

  constructor(public payload: UserCredentials) {
  }
}

export class RegisterSuccess implements Action {
  readonly type = AuthActionTypes.REGISTER_SUCCESS;

  constructor(public payload: AuthUser) {
  }
}

export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN;

  constructor(public payload: UserCredentials) {
  }
}

export class Authenticated implements Action {
  readonly type = AuthActionTypes.AUTHENTICATED;

  constructor(public payload: AuthUser | null) {
  }
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;

  constructor(public payload: AuthUser) {
  }
}

export class LogoutSuccess implements Action {
  readonly type = AuthActionTypes.LOGOUT_SUCCESS;
}

export class Failure implements Action {
  readonly type = AuthActionTypes.FAILURE;

  constructor(public payload: any) {
  }
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LOGIN_REDIRECT;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export type AuthActions =
   Register
  | RegisterSuccess
  | Login
  | Authenticated
  | LoginSuccess
  | Failure
  | LoginRedirect
  | Logout
  | LogoutSuccess;
