import { Component, OnInit } from '@angular/core';
import {PingPayload} from '../../core/models/ping-payload';
import {Store} from '@ngrx/store';
import {Ping} from '../actions/ping.actions';
import {getPingPong, getPongError, PingRootState} from '../reducers';
import {PongPayload} from '../../core/models/pong-payload';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../core/services/auth.service';
import {AuthUser} from '../../auth/models/auth-user';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {

  pong$: Observable<PongPayload>;
  error$: Observable<string>;

  constructor(private store: Store<PingRootState>,
  ) {
    this.pong$ = this.store.select(getPingPong)
      .map(pong => !!pong && pong.pong);
    this.error$ = this.store.select(getPongError)
  }

  ngOnInit() {
  }

  sendPing() {
    this.store.dispatch(new Ping(new PingPayload('PING')))
  }
}
