import {TestBed, async, ComponentFixture, inject, tick, fakeAsync} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CommonModule, Location} from '@angular/common';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {Component, DebugElement, Injectable, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule, By} from '@angular/platform-browser';
import {reducers} from '../../auth/reducers';
import {combineReducers, StoreModule} from '@ngrx/store';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AppConstants} from '../config/app-constants';
import {SecurityService} from '../services/security.service';
import {defer} from 'rxjs/observable/defer';
import {RouterLinkDirectiveStub} from '../../testing/router-link-directive-stub';
import {RouterTestingModule} from '@angular/router/testing';
import {ServicesModule} from '../services/services.module';
import {CookieModule} from 'ngx-cookie';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {IndexComponent} from '../components/index.component';
import {AuthModule} from '../../auth/auth.module';
import {AuthService} from '../services/auth.service';
import {ApiBase} from '../services/api-base';
import {SigninPageComponent} from '../../auth/containers/signin-page.component';
import {SignupPageComponent} from '../../auth/containers/signup-page.component';

@Component({selector: 'app-index', template: ''})
class IndexStubComponent {
}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {
}

@Component({selector: 'app-signin-page', template: ''})
class SigninPageStubComponent {
}

@Component({selector: 'app-signup-page', template: ''})
class SignupPageStubComponent {
}

@Injectable()
export class RouterStub {
  public url;
  private subject = new Subject();
  public events = this.subject.asObservable();

  navigateByUrl(url: string) {
    this.url = url;
    this.triggerNavEvents(url);
  }

  triggerNavEvents(url) {
    let ne = new NavigationEnd(0, url, null);
    this.subject.next(ne);
  }
}

class MockRouter {
  public ne = new NavigationEnd(0, 'http://localhost:4200', 'http://localhost:4200');
  public events = new Observable(observer => {
    observer.next(this.ne);
    observer.complete();
  });
}

class MockRouterNoLogin {
  public ne = new NavigationEnd(0, 'http://localhost:4200/dashboard', 'http://localhost:4200/dashboard');
  public events = new Observable(observer => {
    observer.next(this.ne);
    observer.complete();
  });
}

describe('AppComponent', () => {
  let ne = new NavigationEnd(0, 'http://localhost:4200', 'http://localhost:4200');
  let events: Observable<RouterEvent> = new Observable(observer => {
    observer.next(ne);
    observer.complete();
  });
  events = events.pipe(map(e => e));
  // const routerSpy = jasmine.createSpyObj('Router', {navigateByUrl: 'navigateByUrl', events: events});
  const securityServiceSpy: { authenticate: jasmine.Spy } =
    jasmine.createSpyObj('SecurityService', ['authenticate']);

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
  let mockRegisterUserBody = {
    statusCode: 201,
    body: fakeAuthUser,
    authUser: fakeAuthUser
  };
  let mockAuthenticateBody = {
    statusCode: 200,
    body: fakeAuthUser,
    authUser: fakeAuthUser
  };

  let linkDes: DebugElement[];
  let routerLinks: RouterLinkDirectiveStub[];
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
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
        RouterOutletStubComponent,
        IndexComponent,
        IndexStubComponent,
        SigninPageStubComponent,
        SignupPageStubComponent,
        RouterLinkDirectiveStub
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h3 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Авторизация и аутентификация на Angular');
  }));

  it('should show index page', fakeAsync(inject([Router, Location, HttpTestingController],
    (router: Router, location: Location, backend: HttpTestingController) => {
      const fixture = createRoot(router, AppComponent);
      router.navigateByUrl('/');
      advance(fixture);
      expect(location.path()).toEqual('/');
      let mockReq = backend.expectOne(ApiBase.apiSecurityUrl() + AppConstants.AUTHENTICATE_RESOURCE);

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');

      mockReq.flush(mockAuthenticateBody);
      backend.verify();

      let linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
      routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
      expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
      expect(routerLinks[0].linkParams).toBe('/auth/SignUp');
      expect(routerLinks[1].linkParams).toBe('/auth/SignIn');
    })));

  it('should show login page', fakeAsync(inject([Router, Location, HttpTestingController],
    (router: Router, location: Location, backend: HttpTestingController) => {
      const fixture = createRoot(router, AppComponent);
      router.navigateByUrl('/');
      advance(fixture);
      expect(location.path()).toEqual('/');
      let mockReq = backend.expectOne(ApiBase.apiSecurityUrl() + AppConstants.AUTHENTICATE_RESOURCE);

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');

      mockReq.flush(mockAuthenticateBody);
      backend.verify();

      const app: DebugElement = fixture.debugElement;
      const login = app.query(By.css("a[href='/auth/SignIn']"));
      const loginEl: HTMLElement = login.nativeElement;
      expect(loginEl.textContent).toEqual('Войти');

      loginEl.click();
      advance(fixture);
      expect(location.path()).toEqual('/auth/SignIn');
    })));

  it('should register', fakeAsync(inject([Router, Location, HttpTestingController],
    (router: Router, location: Location, backend: HttpTestingController) => {
      const fixture = createRoot(router, AppComponent);
      router.navigateByUrl('/');
      advance(fixture);
      expect(location.path()).toEqual('/');
      let mockReq = backend.expectOne(ApiBase.apiSecurityUrl() + AppConstants.AUTHENTICATE_RESOURCE);

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');

      mockReq.flush(mockAuthenticateBody);
      backend.verify();

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

      mockReq = backend.expectOne(ApiBase.apiSecurityUrl() + AppConstants.REGISTER_RESOURCE);

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');

      mockReq.flush(mockAuthenticateBody);
      backend.verify();

      advance(fixture);
      expect(location.path()).toEqual('/');

      const logout: HTMLElement = app.queryAll(value => value.nativeElement.textContent == 'Выйти')[0].nativeElement;
      expect(logout.textContent).toEqual('Выйти');
    })));
});

/** Create async observable that emits-once and completes
 *  after a JS engine turn */
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

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
