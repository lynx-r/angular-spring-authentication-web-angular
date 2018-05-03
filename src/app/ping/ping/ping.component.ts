import { Component, OnInit } from '@angular/core';
import {PingPayload} from '../../core/models/ping-payload';
import {Store} from '@ngrx/store';
import {Ping} from '../actions/ping.actions';
import {getPingPong, PingRootState} from '../reducers';
import {PongPayload} from '../../core/models/pong-payload';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {

  pong$: Observable<PongPayload>;

  constructor(private store: Store<PingRootState>) {
    this.pong$ = this.store.select(getPingPong)
      .map(pong => !!pong && pong.payload);
  }

  ngOnInit() {
  }

  sendPing() {
    this.store.dispatch(new Ping(new PingPayload('PING')))
  }
}
