import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {authReducer, AuthState, getLoggedIn, getUser} from './auth';
import {getError, getPending, loginPageReducer, LoginPageState} from './login-page';
import {RootState} from '../../core/reducers/reducer.reducer';

export interface State {
  status: AuthState,
  loginPage: LoginPageState
}

export interface AuthRootState extends RootState {
  auth: State
}

export const reducers: ActionReducerMap<State> = {
  status: authReducer,
  loginPage: loginPageReducer
};

export const getAuthState = createFeatureSelector<State>(
  'auth'
);

export const getStatusState = createSelector(
  getAuthState,
  (state) => state.status
);

export const getLoginPageState = createSelector(
  getAuthState,
  (state) => state.loginPage
);

// Status
export const getUserState = createSelector(
  getStatusState,
  getUser
);

export const getLoggedInState = createSelector(
  getStatusState,
  getLoggedIn
);

// Login page
export const getLoginPageError = createSelector(
  getLoginPageState,
  getError
);
export const getLoginPagePending = createSelector(
  getLoginPageState,
  getPending
);
