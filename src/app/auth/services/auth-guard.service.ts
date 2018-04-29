import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthRootState} from '../reducers';
import {Observable} from 'rxjs/Observable';
import {map, tap} from 'rxjs/operators';
import {UtilsService} from '../../core/services/utils.service';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(
    private store: Store<AuthRootState>,
    private authService: AuthService
  ) {
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return this.authService.authenticate()
  //     .pipe(
  //       map(authUser =>
  //         UtilsService.isLoggedIn(authUser)),
  //       map(_ => true)
  //     )
  // }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
    // return this.authService.authenticate()
    //   .pipe(
    //     map(authUser =>
    //       UtilsService.isLoggedIn(authUser)),
    //     map(_ => true)
    //   )
  }
}
