import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AuthUser, RegisterUser} from '../models/registerUser';
import * as Auth from '../actions/auth';
import {AuthRootState, getLoginPageError, getLoginPagePending} from '../reducers';
import {Login, Register} from '../actions/auth';

@Component({
  selector: 'app-signup-page',
  template: `
    <app-signup
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [errorMessage]="error$ | async">
    </app-signup>
  `,
  styles: [],
})
export class SignupPageComponent implements OnInit {
  pending$ = this.store.pipe(select(getLoginPagePending));
  error$ = this.store.pipe(select(getLoginPageError));

  constructor(private store: Store<AuthRootState>) {}

  ngOnInit() {}

  onSubmit($event: RegisterUser) {
    this.store.dispatch(new Register($event));
  }

}
