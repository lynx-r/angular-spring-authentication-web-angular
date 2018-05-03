import {PongPayload} from '../../core/models/pong-payload';
import {PingActions, PingActionTypes} from '../actions/ping.actions';


export interface PingState {
  pong: PongPayload | null,
  error: string
}

export const initialPingState: PingState = {
  pong: null,
  error: ''
};

export function pingReducer(state = initialPingState, action: PingActions): PingState {
  switch (action.type) {

    case PingActionTypes.PONG:
      return {
        ...state,
        pong: action.payload,
        error: ''
      };

    case PingActionTypes.FAILED:
      return {
        ...state,
        pong: null,
        error: action.payload
      };

    default:
      return state;
  }
}

export const getPong = (store) => store.pong;
export const getError = (store) => store.error;
