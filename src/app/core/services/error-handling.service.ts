import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Failure} from '../../auth/actions/auth';
import {MessageResponse} from '../models/message-response';
import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorHandlingService {

  constructor(
  ) {
  }

  private static httpErrorMessage(error: HttpErrorResponse) {
    return error.status == 0 ? 'Нет соединения с сервером' : error.error.message;
  }

  static handleAuthError(err: any) {
    let message;
    if (err instanceof MessageResponse) {
      message = err.message;
    } else {
      message = ErrorHandlingService.httpErrorMessage(err);
    }
    return Observable.throw(new Failure(message));
  }
}
