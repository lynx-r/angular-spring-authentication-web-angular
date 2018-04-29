import {Injectable} from '@angular/core';
import {NotifyType} from '../models/notify-type.enum';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Failure} from '../../auth/actions/auth';
import {UtilsService} from './utils.service';

@Injectable()
export class ErrorHandlingService {

  constructor(
    private utils: UtilsService,
  ) {
  }

  handleError(error: HttpErrorResponse) {
    let err = error.error;
    if (this.utils.isDevProfile()) {
      console.trace();
      console.log('ERROR', error);
    }
    if (err != undefined) {
      if (err instanceof ErrorEvent) {
        const message = err.message;
        // A client-side or network error occurred. Handle it accordingly.
        this.notifyUser({message: message, type: NotifyType.ERROR});
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        const message = this.httpErrorMessage(error);
        this.notifyUser({message: message, type: NotifyType.ERROR});
      }
    } else {
      this.notifyUser({message: `Ошибка в скрипте ${err}`, type: NotifyType.ERROR});
    }

    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };

  private httpErrorMessage(error: HttpErrorResponse) {
    let err = error.error;
    return error.status == 0 ? error.message
      : ((err != undefined && err.message !== undefined) ? err.message.message : error.message);
  }

  private notifyUser(message: { message: string, type: NotifyType }) {
    switch (message.type) {
      case NotifyType.ALERT:
        alert(message.message);
        break;
      case NotifyType.INFO:
        alert(message.message);
        break;
      case NotifyType.ERROR:
        alert(message.message);
        break;
      default:
        alert(message.message);
        break;
    }
  };

  handleAuthError(err: HttpErrorResponse) {
    const message = this.httpErrorMessage(err);
    return Observable.throw(new Failure(message));
  }
}
