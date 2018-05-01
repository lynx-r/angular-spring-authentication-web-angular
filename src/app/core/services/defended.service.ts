import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppConstants} from '../config/app-constants';
import {ApiDefendedService} from './api-defended.service';
import {MessageResponse} from '../models/message-response';
import {PingPayload} from '../models/ping-payload';
import {PongPayload} from '../models/pong-payload';

@Injectable()
export class DefendedService {
  constructor(
    private apiDefendedService: ApiDefendedService,
  ) {
  }

  ping(
    ping: PingPayload
  ): Observable<PongPayload | MessageResponse | boolean> {
    return this.apiDefendedService
      .post(AppConstants.PING_RESOURCE, ping)
  }
}
