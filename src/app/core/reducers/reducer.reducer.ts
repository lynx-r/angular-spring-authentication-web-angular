import {ActionReducer, MetaReducer} from '@ngrx/store';

import {storeFreeze} from 'ngrx-store-freeze';
import {environment} from '../../../environments/environment';

export interface RootState {
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
// console.log all actions
export function logger(reducer: ActionReducer<RootState>): ActionReducer<RootState> {
  return function (state: RootState, action: any): RootState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<RootState>[] = !environment.production
  ? [logger, storeFreeze]
  : [];
