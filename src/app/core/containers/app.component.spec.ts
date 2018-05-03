import {TestBed, async, ComponentFixture, inject, tick, fakeAsync} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CommonModule, Location} from '@angular/common';
import {Router} from '@angular/router';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule, By} from '@angular/platform-browser';
import {reducers} from '../../auth/reducers';
import {combineReducers, StoreModule} from '@ngrx/store';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AppConstants} from '../config/app-constants';
import {RouterLinkDirectiveStub} from '../../testing/router-link-directive-stub';
import {RouterTestingModule} from '@angular/router/testing';
import {ServicesModule} from '../services/services.module';
import {CookieModule} from 'ngx-cookie';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {IndexComponent} from '../components/index.component';
import {AuthModule} from '../../auth/auth.module';
import {ApiBase} from '../services/api-base';
import {SigninPageComponent} from '../../auth/containers/signin-page.component';
import {SignupPageComponent} from '../../auth/containers/signup-page.component';
import {CookiesService} from '../services/cookies.service';

describe('AppComponent base', () => {
  beforeEach(async(() => {
    configTestBed();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h3 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Авторизация и аутентификация на Angular');
  }));
});

describe('AppComponent index', () => {
  let routerLinks: RouterLinkDirectiveStub[];

  beforeEach(async(() => {
    configTestBed()
  }));

  it('should show index page', fakeAsync(inject([Router, Location, CookiesService],
    (router: Router, location: Location, cookieService: CookiesService) => {
      cookieService.removeAuthUser();

      const fixture = createRoot(router, AppComponent);
      router.navigateByUrl('/');
      advance(fixture);
      expect(location.path()).toEqual('/');

      let linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
      routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
      expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
      expect(routerLinks[0].linkParams).toBe('/auth/SignUp');
      expect(routerLinks[1].linkParams).toBe('/auth/SignIn');
    })));
});

describe('AppComponent login', () => {
  beforeEach(async(() => {
    configTestBed()
  }));

  it('should show login page', fakeAsync(inject([Router, Location, CookiesService],
    (router: Router, location: Location, cookieService: CookiesService) => {
      cookieService.removeAuthUser();

      const fixture = createRoot(router, AppComponent);
      router.navigateByUrl('/');
      advance(fixture);
      expect(location.path()).toEqual('/');

      const app: DebugElement = fixture.debugElement;
      const login = app.query(By.css("a[href='/auth/SignIn']"));
      const loginEl: HTMLElement = login.nativeElement;
      expect(loginEl).not.toBeNull();

      loginEl.click();
      advance(fixture);
      expect(location.path()).toEqual('/auth/SignIn');
    })));

});

describe('AppComponent register', () => {
  beforeEach(async(() => {
    configTestBed();
  }));

  it('should register', fakeAsync(inject([Router, Location, HttpTestingController, CookiesService],
    (router: Router, location: Location, backend: HttpTestingController, cookieService: CookiesService) => {
      cookieService.removeAuthUser();

      const fixture = createRoot(router, AppComponent);
      router.navigateByUrl('/');
      advance(fixture);

      const app: DebugElement = fixture.debugElement;
      const login = app.query(By.css("a[href='/auth/SignUp']"));
      const loginEl: HTMLElement = login.nativeElement;
      expect(loginEl.textContent).toEqual('Зарегистрироваться');

      loginEl.click();
      advance(fixture);
      expect(location.path()).toEqual('/auth/SignUp');

      const email: HTMLInputElement = app.query(By.css("input[type=email]")).nativeElement;
      email.value = mockCredentials.username;
      const password: HTMLInputElement = app.query(By.css("input[type=password]")).nativeElement;
      password.value = mockCredentials.username;

      const submit: HTMLButtonElement = app.query(By.css('button[type=submit]')).nativeElement;
      submit.click();
      advance(fixture);

      authRequest(backend, mockAuthenticateBody, AppConstants.REGISTER_RESOURCE);

      advance(fixture);
      expect(location.path()).toEqual('/');

      const logout: HTMLElement = app.queryAll(value => value.nativeElement.textContent == 'Выйти')[0].nativeElement;
      expect(logout).not.toBeNull();
    })));
});

function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

function createRoot(router: Router, type: any): ComponentFixture<any> {
  const f = TestBed.createComponent(type);
  advance(f);
  router.initialNavigation();
  advance(f);
  return f;
}


let authRequest = function (backend: HttpTestingController, mockAuthenticateBody, authResource) {
  let mockReq = backend.expectOne(ApiBase.apiSecurityUrl() + authResource);

  expect(mockReq.cancelled).toBeFalsy();
  expect(mockReq.request.responseType).toEqual('json');

  mockReq.flush(mockAuthenticateBody);
  backend.verify();
};

let configTestBed = function () {
  TestBed.configureTestingModule({
    imports: [
      CommonModule,
      BrowserModule,
      BrowserAnimationsModule,
      CookieModule.forRoot(),

      ServicesModule,
      AuthModule,
      StoreModule.forRoot({
        ...reducers,
        'feature': combineReducers(reducers)
      }),
      EffectsModule.forRoot([]),
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        {
          path: '',
          component: IndexComponent
        },
        {
          path: 'auth/SignIn',
          component: SigninPageComponent
        },
        {
          path: 'auth/SignUp',
          component: SignupPageComponent
        }
      ]),
    ],
    declarations: [
      AppComponent,
      IndexComponent,
      RouterLinkDirectiveStub
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();
};

let mockCredentials = {
  username: 'пользователь',
  password: 'мой пароль'
};
let fakeAuthUser = {
  userId: 'я',
  username: 'пользователь',
  accessToken: '123',
  userSession: '123',
  authorities: ['USER']
};
let mockAuthenticateBody = {
  statusCode: 200,
  body: fakeAuthUser,
  authUser: fakeAuthUser
};
