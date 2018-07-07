import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppConstants} from '../config/app-constants';
import {UserCredentials} from '../../auth/models/user-credentials';
import {ApiSecurityService} from './api-security.service';
import {AuthUser} from '../../auth/models/auth-user';
import 'rxjs/add/observable/empty';
import {map, switchMap} from 'rxjs/operators';
import * as crypto from 'crypto-js';

@Injectable()
export class SecurityService {
  constructor(
    private apiSecurityService: ApiSecurityService
  ) {
  }

  authRequest(
    userCredentials: UserCredentials
  ): Observable<AuthUser> {
    userCredentials = {...userCredentials, passwordHash: '*'.repeat(64), password: ''};
    return this.apiSecurityService
      .post(AppConstants.AUTH_REQUEST_RESOURCE, userCredentials);
  }

  register(
    userCredentials: UserCredentials
  ): Observable<AuthUser> {
    return this.authRequest(userCredentials)
      .pipe(
        switchMap(authUser => {
          let salt = authUser.salt;
          let cost = authUser.cost;
          let misc = authUser.misc;
          let hash = crypto.PBKDF2(userCredentials.password, salt, {
            hasher: crypto.algo.SHA512,
            keySize: misc,
            iterations: cost
          });
          userCredentials = {...userCredentials, passwordHash: hash.toString()};
          // регистрируме пользователя
          return this.apiSecurityService
            .post(AppConstants.REGISTER_RESOURCE, userCredentials)
            .pipe(
              switchMap(authUserReg => {
                // получаем соль для зарегистрированного пользователя
                return this.authRequest(userCredentials)
                  .pipe(
                    switchMap(authUserPost => {
                      salt = authUserPost.salt;
                      cost = authUserPost.cost;
                      misc = authUserPost.misc;
                      hash = crypto.PBKDF2(userCredentials.password, salt, {
                        hasher: crypto.algo.SHA512,
                        keySize: misc,
                        iterations: cost
                      });
                      userCredentials = {...userCredentials, passwordHash: hash.toString()};
                      // сохраняем нового пользователя
                      return this.apiSecurityService
                        .put(AppConstants.REGISTER_RESOURCE, userCredentials);
                    })
                  );
              })
            );
        })
      );
  }

  authorize(
    userCredentials: UserCredentials
  ): Observable<AuthUser> {
    return this.authRequest(userCredentials)
      .pipe(
        switchMap(authUser => {
          const salt = authUser.salt;
          const cost = authUser.cost;
          const misc = authUser.misc;
          const hash = crypto.PBKDF2(userCredentials.password, salt, {hasher: crypto.algo.SHA512, keySize: misc, iterations: cost});
          userCredentials = {...userCredentials, passwordHash: hash.toString()};
          return this.apiSecurityService
            .post(AppConstants.AUTHORIZE_RESOURCE, userCredentials);
        })
      );
  }

  authenticate(
    authUser: AuthUser | null
  ): Observable<AuthUser> {
    if (authUser == null) {
      return Observable.empty();
    }
    return this.apiSecurityService
      .post(AppConstants.AUTHENTICATE_RESOURCE, authUser);
  }

  logout() {
    return this.apiSecurityService
      .get(AppConstants.LOGOUT_RESOURCE);
  }
}
