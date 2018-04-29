import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {AppConstants} from '../config/app-constants';
import {UtilsService} from './utils.service';
import {AuthService} from '../../auth/services/auth.service';
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
          let isLoggedIn = UtilsService.isLoggedIn(authUser);
          if (isLoggedIn) {
            clonedRequest = clonedRequest.clone(
              {
                headers:
                  clonedRequest.headers
                    .append(AppConstants.ACCESS_TOKEN_HEADER, authUser.accessToken)
                    .append(AppConstants.USER_SESSION_HEADER, authUser.userSession)
                    .append(AppConstants.AUTH_COUNTER_SESSION_HEADER, authUser.counter.toString())
                    .append(AppConstants.FILTER_EXPRESSION_HEADER, authUser.filterExpression)
                    .append(AppConstants.FILTER_VALUES_HEADER, JSON.stringify(authUser.filterValues))
                    .append(AppConstants.USER_ROLES_HEADER, authUser.roles.join(','))
              }
            );
          } else {
            clonedRequest = clonedRequest.clone(
              {
                headers:
                  clonedRequest.headers
                    .append(AppConstants.USER_ROLES_HEADER, AppConstants.ANONYMOUS_ROLE)
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