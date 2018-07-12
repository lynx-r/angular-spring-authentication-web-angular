import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AppConstants} from '../config/app-constants';
import {Utils} from './utils.service';
import {AuthService} from './auth.service';
import {map, switchMap} from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getLoggedUser()
      .pipe(
        map(authUser => {
          let clonedRequest = req.clone();
          let isLoggedIn = Utils.isLoggedIn(authUser);
          if (isLoggedIn) {
            clonedRequest = clonedRequest.clone(
              {
                headers:
                  clonedRequest.headers
                    .append(AppConstants.ACCESS_TOKEN_HEADER, authUser.accessToken)
                    .append(AppConstants.USER_SESSION_HEADER, authUser.userSession)
              }
            );
          }
          return next.handle(clonedRequest);
        }),
        switchMap(value => {
          return value;
        }),
      );
  }
}
