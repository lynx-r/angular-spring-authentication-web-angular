import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {Store} from '@ngrx/store';

import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router, RouterEvent,
} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {RootState} from '../reducers/reducer.reducer';
import {Location} from '@angular/common';
import {AuthService} from '../services/auth.service';
import {filter, switchMap, take, takeUntil} from 'rxjs/operators';
import {Failure} from '../../auth/actions/auth';

@Component({
  selector: 'app-root',
  template: `
    <a (click)="handleBack()">Назад</a>
    <div>
      <h3>Авторизация и аутентификация на Angular</h3>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    *, /deep/ * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {

  private navigationEnd$: Observable<any>;
  private navigationStart$: Subscription;
  private navigationAuthSubscription$: Subscription;

  constructor(private store: Store<RootState>,
              private router: Router,
              private location: Location,
              private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.navigationEnd$ = this.router.events
      .pipe(
        filter((e: RouterEvent): e is NavigationEnd | NavigationCancel | NavigationEnd =>
          e instanceof NavigationEnd
          || e instanceof NavigationCancel
          || e instanceof NavigationError
        )
      );

    this.navigationStart$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.navigationEnd$),
      )
      .subscribe();

    this.navigationAuthSubscription$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        switchMap(() => this.authService.authenticate()
          .catch((error: Failure ) => {
            return Observable.of(error);
          })
        ),
        take(1)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.navigationStart$.unsubscribe();
    this.navigationAuthSubscription$.unsubscribe();
  }

  handleBack() {
    this.location.back();
  }
}
