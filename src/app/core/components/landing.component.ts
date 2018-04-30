import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {SecuredService} from '../services/secured.service';
import {PingPayload} from '../models/ping-payload';
import {PongPayload} from '../models/pong-payload';
import {AnswerMessage} from '../models/answer-message';
import {Logout} from '../../auth/actions/auth';
import {getLoggedInState, getUserState} from '../../auth/reducers/index';
import {Observable} from 'rxjs/Observable';
import {AuthUser} from '../../auth/models/auth-user';

@Component({
  selector: 'app-landing',
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
    <div>
      <a (click)="sendPing()">Послать пинг</a>
    </div>
    <div>
      Ответ:
      <span *ngIf="!!pong">{{pong?.pong}}</span>
      <span *ngIf="!pong && !error">Ответ ещё не получен</span>
      <span *ngIf="!!error">{{error}}</span>
    </div>
  `,
  styles: [`

  `]
})
export class LandingComponent implements OnInit {

  pong: PongPayload;
  error: string;
  authUser$: Observable<AuthUser>;
  loggedIn$: Observable<boolean>;

  constructor(private store: Store<any>,
              private securedService: SecuredService) {
    this.authUser$ = this.store.select(getUserState);
    this.loggedIn$ = this.store.select(getLoggedInState);
  }

  ngOnInit() {
  }

  sendPing() {
    this.securedService.ping(new PingPayload('PING'))
      .subscribe(
        (pong) => {
          if (!!pong) {
            this.pong = pong as PongPayload;
            this.error = '';
          }
        },
        (error: AnswerMessage) => {
          this.pong = null;
          this.error = error.message;
        }
      );
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
