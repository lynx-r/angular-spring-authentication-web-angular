import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {reducers} from '../../auth/reducers';
import {combineReducers, StoreModule} from '@ngrx/store';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SecurityService} from '../services/security.service';
import {defer} from 'rxjs/observable/defer';
import {RouterTestingModule} from '@angular/router/testing';
import {ServicesModule} from '../services/services.module';
import {CookieModule} from 'ngx-cookie';
import {IndexComponent} from './index.component';

describe('IndexComponent', () => {
  const securityServiceSpy: { authenticate: jasmine.Spy } =
    jasmine.createSpyObj('SecurityService', ['authenticate']);

  let fakeAuthUser = {
    userId: 'я',
    username: 'пользователь',
    accessToken: '123',
    userSession: '123',
    authorities: ['USER']
  };

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
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/app'},
        {provide: SecurityService, useValue: securityServiceSpy}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexComponent);

    securityServiceSpy.authenticate.and.returnValue(asyncData(fakeAuthUser));
    fixture.detectChanges();
  }));
});

/** Create async observable that emits-once and completes
 *  after a JS engine turn */
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
