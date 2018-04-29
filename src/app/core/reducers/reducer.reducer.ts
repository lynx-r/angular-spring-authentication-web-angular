import {ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';

import { storeFreeze } from 'ngrx-store-freeze';
import {getLayoutShowSidenav, layoutReducer, LayoutState} from './layout';
import {environment} from '../../../environments/environment';

export interface RootState {
  layout: LayoutState;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<RootState> = {
  layout: layoutReducer,
};

// console.log all actions
export function logger(reducer: ActionReducer<RootState>): ActionReducer<RootState> {
  return function(state: RootState, action: any): RootState {
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

export const getWikiState = createFeatureSelector<RootState>(
  'wiki'
);

/**
 * Layout Reducers
 */
export const getLayoutState = createFeatureSelector<LayoutState>('layout');

export const getShowSidenav = createSelector(
  getLayoutState,
  getLayoutShowSidenav
);
