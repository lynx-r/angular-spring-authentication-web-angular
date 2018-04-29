import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthRootState, getUserState} from '../reducers';
import {Store} from '@ngrx/store';
import {UtilsService} from '../../core/services/utils.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private store: Store<AuthRootState>,
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.store.select(getUserState)
      .map(authUser => UtilsService.isLoggedIn(authUser));
  }
}
