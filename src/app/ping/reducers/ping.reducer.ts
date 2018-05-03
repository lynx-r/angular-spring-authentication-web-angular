import { Action } from '@ngrx/store';
import {PongPayload} from '../../core/models/pong-payload';
import {PingActions, PingActionTypes} from '../actions/ping.actions';


export interface PingState {
  pong: PongPayload | null
}

export const initialPingState: PingState = {
  pong: null
};

export function pingReducer(PingState = initialPingState, action: PingActions): PingState {
  switch (action.type) {

    case PingActionTypes.PONG:
      return {
        ...PingState,
        pong: action.payload
      };

    default:
      return PingState;
  }
}

export const getPong = (store) => store.pong;
