import { TestBed, inject } from '@angular/core/testing';
import {ErrorHandlingService} from './error-handling.service';

describe('ErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlingService]
    });
  });

  it('should be created', inject([ErrorHandlingService], (service: ErrorHandlingService) => {
    expect(service).toBeTruthy();
  }));
});
