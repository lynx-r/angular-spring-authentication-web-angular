import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CookiesService} from './cookies.service';
import {CookieService} from 'ngx-cookie';
import {Utils} from './utils.service';
import {AuthService} from './auth.service';
import {PingService} from './ping.service';
import {ApiPingService} from './api-ping.service';
import {ApiBase} from './api-base';
import {ApiSecurityService} from './api-security.service';
import {SecurityService} from './security.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    AuthService,
    ApiBase,
    ApiSecurityService,
    SecurityService,
    ApiPingService,
    PingService,
    CookieService,
    CookiesService,
    Utils,
  ]
})
export class ServicesModule { }
