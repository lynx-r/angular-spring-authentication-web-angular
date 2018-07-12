import {AuthActions, AuthActionTypes} from '../actions/auth';
import {Utils} from '../../core/services/utils.service';
import {AuthUser} from '../models/auth-user';

export interface AuthState {
  loggedIn: boolean;
  user: AuthUser | null;
}

export const initialState: AuthState = {
  loggedIn: false,
  user: null,
};

export function authReducer(state = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.REGISTER_SUCCESS:
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.payload,
      };

    case AuthActionTypes.AUTHENTICATED:
      return {
        ...state,
        loggedIn: Utils.isLoggedIn(action.payload),
        user: action.payload
      };

    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: false,
        user: null
      };

    default:
      return state;
  }
}

export const getLoggedIn = (state: AuthState) => state.loggedIn;
export const getUser = (state: AuthState) => state.user;
