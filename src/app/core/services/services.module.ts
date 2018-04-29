import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ErrorHandlingService} from './error-handling.service';
import {CookiesService} from './cookies.service';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from './utils.service';
import {AuthService} from '../../auth/services/auth.service';
import {SecuredService} from './secured.service';
import {ApiSecuredService} from './api-secured.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AuthService,
    ApiSecuredService,
    SecuredService,
    ErrorHandlingService,
    CookieService,
    CookiesService,
    UtilsService
  ]
})
export class ServicesModule { }
