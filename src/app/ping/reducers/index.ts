import {loginPageReducer, LoginPageState} from '../../auth/reducers/login-page';
import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {authReducer, AuthState} from '../../auth/reducers/auth';
import {RootState} from '../../core/reducers/reducer.reducer';
import {getError, getPong, pingReducer, PingState} from './ping.reducer';

export interface State {
  ping: PingState,
}

export interface PingRootState extends RootState {
  ping: State
}

export const reducers: ActionReducerMap<State> = {
  ping: pingReducer,
};

export const getPingStateSelector = createFeatureSelector<State>(
  'ping'
);

export const getPingState = createSelector(
  getPingStateSelector,
  (state: State) => state.ping
);

export const getPingPong = createSelector(
  getPingState,
  getPong
);

export const getPongError = createSelector(
  getPingState,
  getError
);
