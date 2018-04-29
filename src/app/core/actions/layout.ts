import { Action } from '@ngrx/store';

export const OPEN_SIDENAV = '[Layout] Open Sidenav';

export class OpenSidenav implements Action {
  readonly type = OPEN_SIDENAV;

  constructor(public payload: any){}
}

export type Actions = OpenSidenav ;
