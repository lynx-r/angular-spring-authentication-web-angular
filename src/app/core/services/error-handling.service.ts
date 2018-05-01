import {Injectable} from '@angular/core';
import {NotifyType} from '../models/notify-type.enum';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Failure} from '../../auth/actions/auth';
import {UtilsService} from './utils.service';
import {MessageResponse} from '../models/message-response';

@Injectable()
export class ErrorHandlingService {

  constructor(
  ) {
  }

  private httpErrorMessage(error: HttpErrorResponse) {
    return error.status == 0 ? error.message : error.error.message;
  }

  handleAuthError(err: any) {
    let message;
    if (err instanceof MessageResponse) {
      message = err.message;
    } else {
      message = this.httpErrorMessage(err);
    }
    return Observable.throw(new Failure(message));
  }
}
