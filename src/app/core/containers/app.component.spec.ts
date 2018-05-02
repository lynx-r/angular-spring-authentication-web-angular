import {TestBed, async, ComponentFixture, inject, tick, fakeAsync} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CommonModule, Location} from '@angular/common';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {Component, DebugElement, Injectable, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule, By} from '@angular/platform-browser';
import {reducers} from '../../auth/reducers';
import {combineReducers, StoreModule} from '@ngrx/store';
import {HttpClientTestingModule} from '@angular/common/http/testing';
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
    type: AppConstants.USER_CREDENTIALS_PAYLOAD_CLASS,
    username: 'alex.po',
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
      providers: [
        {provide: SecurityService, useValue: securityServiceSpy},
        // {provide: Router, useValue: routerSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);

    securityServiceSpy.authenticate.and.returnValue(asyncData(fakeAuthUser));
    fixture.detectChanges();

    // find DebugElements with an attached RouterLinkStubDirective
    linkDes = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances
    // using each DebugElement's injector
    routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  }));

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h3 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Авторизация и аутентификация на Angular');
  }));

  it('should show index page', fakeAsync(inject([Router, Location], (router: Router, location: Location) => {
    const fixture = createRoot(router, AppComponent);
    router.navigateByUrl('/');
    advance(fixture);
    expect(location.path()).toEqual('/');

    let linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
  })));

  // it('can get RouterLinks from template', () => {
  //   expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
  //   expect(routerLinks[0].linkParams).toBe('/dashboard');
  //   expect(routerLinks[1].linkParams).toBe('/heroes');
  //   expect(routerLinks[2].linkParams).toBe('/about');
  // });

  // it('should redirect to register page', async(() => {
  //   fixture.detectChanges();
  //
  //   const app: DebugElement = fixture.debugElement;
  //   const login = app.query(By.css('h5'));
  //   const loginEl: HTMLElement = login.nativeElement;
  //   expect(loginEl.textContent).toEqual('Привет!');
  // }));
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
