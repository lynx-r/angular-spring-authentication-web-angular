import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
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
  Router,
} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {RootState} from '../reducers/reducer.reducer';
import {Location} from '@angular/common';
import {Logout} from '../../auth/actions/auth';
import {AuthService} from '../../auth/services/auth.service';
import {catchError, filter, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {ErrorHandlingService} from '../services/error-handling.service';

@Component({
  selector: 'app-root',
  template: `
    <a (click)="handleBack()">Назад</a>
    <router-outlet></router-outlet>
  `,
  styles: [`
    *, /deep/ * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .sidenav {
      width: 300px;
    }

    .sidenav-right {
      width: 400px;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {

  private navigationEnd$: Observable<any>;
  private navigationStart$: Subscription;
  private navigationEndSubscription$: Subscription;
  private navigationAuthSubscription$: Subscription;

  constructor(private store: Store<RootState>,
              private router: Router,
              private location: Location,
              private authService: AuthService,
              private errorHandler: ErrorHandlingService
  ) {
  }

  ngOnInit() {
    this.navigationEnd$ = this.router.events.filter(
      event =>
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
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
        switchMap(_ => this.authService.authenticate()
          .pipe(
            catchError(error => {
              console.log(`ПРОПУСК: Ошибка авторизации: ${error.payload}`);
              return Observable.of(error);
            })
          )
        ),
        take(1)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.navigationAuthSubscription$.unsubscribe();
    this.navigationStart$.unsubscribe();
    this.navigationEndSubscription$.unsubscribe();
  }

  handleBack() {
    this.location.back();
  }
}
