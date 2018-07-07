import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Failure} from '../../auth/actions/auth';
import {Utils} from './utils';
import {AppConstants} from '../config/app-constants';
import {profile} from '../config/profile';
import {HttpError} from '../actions/general';
import {CookiesService} from './cookies.service';

@Injectable()
export class ErrorHandlingService {

  private static httpErrorMessage(error: HttpErrorResponse) {
    const err = error.error;
    return error.status === 0 ? AppConstants.FAIL_SERVER_CONNECTION
      : ((err !== undefined && err.message !== undefined) ? err.message.message : error.message);
  }

  constructor(
    private cookieService: CookiesService,
  ) {
  }

  handleError(error: any) {
    const err = error.error;
    if (profile === 'dev') {
      console.log('DEV ERROR INFO', error.message);
    }
    if (error.message === 'answer is null') {
      return Observable.throw(new HttpError('Нет контента', true));
    }
    let msg = 'Что то пошло не так, попробуйте позже';
    if (err !== undefined) {
      if (err instanceof ErrorEvent) {
        const message = err.message;
        msg = message;
        // A client-side or network error occurred. Handle it accordingly.
        this.notifyUser({message: message, type: 'ERROR'});
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        const message = ErrorHandlingService.httpErrorMessage(error);
        msg = message;
        this.notifyUser({message: message.join(','), type: 'ERROR'});
      }
    } else if ('payload' in error) {
      const message = error.payload;
      msg = message;
      this.notifyUser({message: message, type: 'ERROR'});
    } else {
      const message = `Ошибка в коде ${err}`;
      msg = message;
      this.notifyUser({message: message, type: 'ERROR'});
    }

    // return an ErrorObservable with a user-facing error message
    return Observable.throw(new HttpError(msg));
  }

  notifyUser(message: { message: string, type: string }) {
    switch (message.type) {
      case 'ALERT':
      case 'INFO':
      case 'ERROR':
        alert(message.message);
        break;
      default:
        alert(message.message);
        break;
    }
  }

  handleAuthError(err: HttpErrorResponse) {
    if (err.status !== 400) {
      this.cookieService.removeAuthUser();
    }

    const message = ErrorHandlingService.httpErrorMessage(err);
    return Observable.throw(new Failure(message));
  }
}
