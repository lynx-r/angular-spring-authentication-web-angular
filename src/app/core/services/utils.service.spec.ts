import {inject, TestBed} from '@angular/core/testing';

import {Utils} from './utils.service';

describe('Utils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Utils]
    });
  });

  it('should be created', inject([Utils], (service: Utils) => {
    expect(service).toBeTruthy();
  }));
});
