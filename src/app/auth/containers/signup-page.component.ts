import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {UserCredentials} from '../models/user-credentials';
import {AuthRootState, getLoginPageError, getLoginPagePending} from '../reducers';
import {Register} from '../actions/auth';

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

  constructor(private store: Store<AuthRootState>) {
  }

  ngOnInit() {
  }

  onSubmit($event: UserCredentials) {
    this.store.dispatch(new Register($event));
  }

}
