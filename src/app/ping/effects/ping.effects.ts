import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {Failed, Ping, PingActionTypes, Pong} from '../actions/ping.actions';
import {PingService} from '../../core/services/ping.service';
import {Observable} from 'rxjs/Observable';
import {PongPayload} from '../../core/models/pong-payload';


@Injectable()
export class PingEffects {

  @Effect()
  ping$ = this.actions$
    .pipe(
      ofType(PingActionTypes.PING),
      map((action: Ping) => action.payload),
      switchMap(ping => this.pingService.ping(ping)
        .pipe(
          mergeMap((pong: PongPayload) => Observable.of(new Pong(pong))),
          catchError((error) => {
            return Observable.of(new Failed(error.payload));
          })
        ))
    );

  constructor(private actions$: Actions, private pingService: PingService) {
  }
}
