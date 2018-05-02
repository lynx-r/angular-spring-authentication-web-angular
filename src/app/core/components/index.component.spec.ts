import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {Router} from '@angular/router';
import { DebugElement} from '@angular/core';
import { By} from '@angular/platform-browser';
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
import {IndexComponent} from './index.component';

describe('IndexComponent', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
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
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CookieModule.forRoot(),

        ServicesModule,
        StoreModule.forRoot({
          ...reducers,
          'feature': combineReducers(reducers)
        }),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        IndexComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/app'},
        {provide: SecurityService, useValue: securityServiceSpy}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexComponent);

    securityServiceSpy.authenticate.and.returnValue(asyncData(fakeAuthUser));
    fixture.detectChanges();

    // find DebugElements with an attached RouterLinkStubDirective
    linkDes = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances
    // using each DebugElement's injector
    routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  }));

  // it('should create the app', async(() => {
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));

  // it('should render title in a h3 tag', async(() => {
  //   fixture.detectChanges();
  //
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h3').textContent).toContain('Аутентификация на Angular');
  // }));

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
