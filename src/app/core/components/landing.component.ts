import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {SecuredService} from '../services/secured.service';
import {PingPayload} from '../models/ping-payload';
import {PongPayload} from '../models/pong-payload';
import {AnswerMessage} from '../models/answer-message';
import {Logout} from '../../auth/actions/auth';

@Component({
  selector: 'app-landing',
  template: `
    <div>
      <a routerLink="/auth/SignUp">Зарегистрироваться</a>
    </div>
    <div>
      <a routerLink="/auth/SignIn">Войти</a>
    </div>
    <div>
      <a (click)="logout()">Выйти</a>
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

  constructor(private store: Store<any>,
              private securedService: SecuredService) {
  }

  ngOnInit() {
  }

  sendPing() {
    this.securedService.ping(new PingPayload())
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
