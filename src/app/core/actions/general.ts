import {Action} from '@ngrx/store';

export enum HttpFailActionTypes {
  HTTP_FAIL = '[Http Fail] Fail actions'
}

export class HttpError implements Action {
  readonly type = HttpFailActionTypes.HTTP_FAIL;

  constructor(public payload: any, public ignore?: boolean) {
  }
}

export type Actions = HttpError;
