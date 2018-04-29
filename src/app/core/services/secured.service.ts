import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppConstants} from '../config/app-constants';
import {ApiSecuredService} from './api-secured.service';
import {AnswerMessage} from '../models/answer-message';
import {PingPayload} from '../models/ping-payload';
import {PongPayload} from '../models/pong-payload';

@Injectable()
export class SecuredService {
  constructor(
    private apiSecuredService: ApiSecuredService,
  ) {
  }

  ping(
    ping: PingPayload
  ): Observable<PongPayload | AnswerMessage | boolean> {
    return this.apiSecuredService
      .post(AppConstants.PING_RESOURCE, ping)
  }
}
