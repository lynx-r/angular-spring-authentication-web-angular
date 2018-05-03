import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';

import { PingEffects } from './ping.effects';

describe('PingService', () => {
  let actions$: Observable<any>;
  let effects: PingEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PingEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(PingEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
