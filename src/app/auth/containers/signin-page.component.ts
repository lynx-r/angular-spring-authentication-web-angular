import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {UserCredentials} from '../models/user-credentials';
import {AuthRootState, getLoginPageError, getLoginPagePending} from '../reducers';
import {Login} from '../actions/auth';

@Component({
  selector: 'app-signin-page',
  template: `
    <app-signin
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [errorMessage]="error$ | async">
    </app-signin>
  `,
  styles: [],
})
export class SigninPageComponent implements OnInit {
  pending$ = this.store.pipe(select(getLoginPagePending));
  error$ = this.store.pipe(select(getLoginPageError));

  constructor(private store: Store<AuthRootState>) {
  }

  ngOnInit() {
  }

  onSubmit($event: UserCredentials) {
    this.store.dispatch(new Login($event));
  }
}
