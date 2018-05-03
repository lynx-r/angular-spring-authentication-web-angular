import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppConstants} from '../config/app-constants';
import {ApiPingService} from './api-ping.service';
import {MessageResponse} from '../models/message-response';
import {PingPayload} from '../models/ping-payload';
import {PongPayload} from '../models/pong-payload';

@Injectable()
export class PingService {
  constructor(
    private apiPingService: ApiPingService,
  ) {
  }

  ping(
    ping: PingPayload
  ): Observable<PongPayload | MessageResponse | boolean> {
    return this.apiPingService
      .post(AppConstants.PING_RESOURCE, ping)
  }
}
