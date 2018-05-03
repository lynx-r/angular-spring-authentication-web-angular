import {AppComponent} from './containers/app.component';
import {NotFoundPageComponent} from './containers/not-found-page';
import {BrowserModule} from '@angular/platform-browser';
import {CoreRoutingModule} from './core-routing.module';
import {EffectsModule} from '@ngrx/effects';
import {environment} from '../../environments/environment';
import {StoreModule} from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {metaReducers} from './reducers/reducer.reducer';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './components/index.component';
import {NgModule} from '@angular/core';
import {ApiInterceptor} from './services/api-interceptor';
import {AuthModule} from '../auth/auth.module';
import {ServicesModule} from './services/services.module';
import {CookieModule} from 'ngx-cookie';
import {reducers} from '../auth/reducers';
import {PingModule} from '../ping/ping.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreRoutingModule,

    CookieModule.forRoot(),
    StoreModule.forRoot(reducers, {metaReducers}),

    /**
     * EffectsModule.forRoot() is imported once in the root module and
     * sets up the effects class to be initialized immediately when the
     * application starts.
     *
     * See: https://github.com/ngrx/platform/blob/master/docs/effects/api.md#forroot
     */
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    ServicesModule,
    AuthModule,
    PingModule
  ],
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    IndexComponent,
    NotFoundPageComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
  ]
})
export class CoreModule {
}
