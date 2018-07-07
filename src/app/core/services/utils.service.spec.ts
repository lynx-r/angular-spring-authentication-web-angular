import { TestBed, inject } from '@angular/core/testing';

import { Utils } from './utils';

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
