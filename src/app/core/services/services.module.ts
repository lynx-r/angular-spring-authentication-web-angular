import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookiesService} from './cookies.service';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from './utils.service';
import {AuthService} from './auth.service';
import {DefendedService} from './defended.service';
import {ApiDefendedService} from './api-defended.service';
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

    ApiDefendedService,
    DefendedService,

    CookieService,
    CookiesService,

    UtilsService,
  ]
})
export class ServicesModule { }
