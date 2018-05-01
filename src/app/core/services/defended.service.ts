import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppConstants} from '../config/app-constants';
import {ApiDefendedService} from './api-defended.service';
import {AnswerMessage} from '../models/answer-message';
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
  ): Observable<PongPayload | AnswerMessage | boolean> {
    return this.apiDefendedService
      .post(AppConstants.PING_RESOURCE, ping)
  }
}
