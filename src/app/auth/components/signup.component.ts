import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthUser, RegisterUser} from '../models/registerUser';
import {FormControl, FormGroup} from '@angular/forms';
import {AppConstants} from '../../core/config/app-constants';

@Component({
  selector: 'app-signup',
  template: `
    <div>
      <div>Зарегистрируйтесь чтобы стать автором</div>
      <div class="full-width">
        <form [formGroup]="form" (ngSubmit)="submit()" class="full-width">
          <p>
          <div class="full-width">
            <input type="email" placeholder="Эл. почта"
                   formControlName="username">
          </div>
          <p>
          <div class="full-width">
            <input type="password" placeholder="Пароль" formControlName="password">
          </div>
          <p *ngIf="errorMessage" class="alert-danger full-width">
            {{ errorMessage }}
          </p>
          <p class="loginButtons">
            <button type="submit">Зарегистрироваться</button>
          </p>
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

    .loginButtons {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  `]
})
export class SignupComponent implements OnInit {

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  @Input() errorMessage: string | null;

  @Output() submitted = new EventEmitter<RegisterUser>();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor() {
  }

  ngOnInit() {
    this.errorMessage = '';
  }

  submit() {
    if (this.form.valid) {
      let credentials = <RegisterUser>{...this.form.value, type: AppConstants.REGISTER_USER_PAYLOAD_CLASS};
      this.submitted.emit(credentials);
    }
  }

}
