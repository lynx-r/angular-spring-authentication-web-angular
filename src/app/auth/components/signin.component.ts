import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {UserCredentials} from '../models/user-credentials';
import {FormControl, FormGroup} from '@angular/forms';
import {AppConstants} from '../../core/config/app-constants';

@Component({
  selector: 'app-signin',
  template: `
    <div>
      <div>Войти</div>
      <div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <input type="email" placeholder="Эл. почта"
                   formControlName="username">
          </div>
          <div>
            <input type="password" placeholder="Пароль"
                   formControlName="password">
          </div>
          <div *ngIf="errors.length > 0">
            <div *ngFor="let error of errors">
              <div class="alert-danger">{{error}}</div>
            </div>
          </div>
          <div class="loginButtons">
            <button type="submit">Войти</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      margin: 72px 0;
    }

    .alert-danger {
      color: red;
    }

    .loginButtons {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  `]
})
export class SigninComponent implements OnInit, OnChanges {

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  @Input() errorMessage: string | null;
  errors: string[];

  @Output() submitted = new EventEmitter<UserCredentials>();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor() {
  }

  ngOnInit() {
    this.errors = [];
    this.errorMessage = '';
  }

  ngOnChanges() {
    if (!!this.errorMessage) {
      // ошибки приходят в виде слепленных через ; строк. Повод для рефакторинга 😉
      this.errors = this.errorMessage.split(';');
    }
  }

  submit() {
    if (this.form.valid) {
      let credentials = <UserCredentials>{...this.form.value, type: AppConstants.USER_CREDENTIALS_PAYLOAD_CLASS};
      this.submitted.emit(credentials);
    }
  }
}
