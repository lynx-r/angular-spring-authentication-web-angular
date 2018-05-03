import { Action } from '@ngrx/store';
import {PingPayload} from '../../core/models/ping-payload';
import {PongPayload} from '../../core/models/pong-payload';

export enum PingActionTypes {
  PING = '[Ping] Ping Action',
  PONG = '[Ping] Pong Action',
  FAILED = '[Ping] Failed Action'
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

export class Failed implements Action {
  readonly type = PingActionTypes.FAILED;

  constructor(public payload: string) {
  }
}

export type PingActions = Ping | Pong | Failed;
