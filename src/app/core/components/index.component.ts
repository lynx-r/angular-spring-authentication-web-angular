import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {PingService} from '../services/ping.service';
import {PingPayload} from '../models/ping-payload';
import {PongPayload} from '../models/pong-payload';
import {MessageResponse} from '../models/message-response';
import {Failure, Logout} from '../../auth/actions/auth';
import {Observable} from 'rxjs/Observable';
import {AuthUser} from '../../auth/models/auth-user';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-index',
  template: `
    <div>
      <a routerLink="/auth/SignUp">Зарегистрироваться</a>
    </div>
    <div *ngIf="!(loggedIn$ | async)">
      <a routerLink="/auth/SignIn">Войти</a>
    </div>
    <div *ngIf="loggedIn$ | async">
      <a (click)="logout()">Выйти</a>
    </div>
    <div *ngIf="loggedIn$ | async">
      Вы вошли как: {{(authUser$ | async).username}}
    </div>
    <!--Нужно было бы сделать app-page-ping как контайнер из модуля ping.module-->
    <app-ping></app-ping>
  `,
  styles: [`

  `]
})
export class IndexComponent implements OnInit {

  authUser$: Observable<AuthUser>;
  loggedIn$: Observable<boolean>;

  constructor(private store: Store<any>,
              private authService: AuthService) {
    this.authUser$ = this.authService.getLoggedUser();
    this.loggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit() {
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
