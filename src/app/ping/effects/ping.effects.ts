import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {Ping, PingActionTypes, Pong} from '../actions/ping.actions';
import {DefendedService} from '../../core/services/defended.service';
import {Observable} from 'rxjs/Observable';
import {PongPayload} from '../../core/models/pong-payload';


@Injectable()
export class PingEffects {

  @Effect()
  ping$ = this.actions$
    .pipe(
      ofType(PingActionTypes.PING),
      map((action: Ping) => action.payload),
      switchMap(ping => this.defendedService.ping(ping)
        .pipe(
          mergeMap((pong: PongPayload) => Observable.of(new Pong(pong))),
          catchError((error) => {
            console.error(error);
            alert(error.payload);
            return Observable.of(error);
          })
        ))
    );

  constructor(private actions$: Actions, private defendedService: DefendedService) {
  }
}
