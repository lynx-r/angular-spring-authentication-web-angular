import * as general from '../actions/general';
import {HttpFailActionTypes} from '../actions/general';

export interface GeneralState {
  error: any;
}

const initialState: GeneralState = {
  error: null,
};

export function generalReducer(state = initialState, action: general.Actions): GeneralState {
  switch (action.type) {
    case HttpFailActionTypes.HTTP_FAIL:
      return {
        error: action.payload,
      };

    default:
      return state;
  }
}

export const getHttpError = (state: GeneralState) => state.error;
