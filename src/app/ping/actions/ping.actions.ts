import { Action } from '@ngrx/store';
import {PingPayload} from '../../core/models/ping-payload';
import {PongPayload} from '../../core/models/pong-payload';

export enum PingActionTypes {
  PING = '[Ping] Action',
  PONG = '[Pong] Action'
}

export class Ping implements Action {
  readonly type = PingActionTypes.PING;

  constructor(public payload: PingPayload) {
  }
}

export class Pong implements Action {
  readonly type = PingActionTypes.PONG;

  constructor(public payload: PongPayload) {
  }
}

export type PingActions = Ping | Pong;
