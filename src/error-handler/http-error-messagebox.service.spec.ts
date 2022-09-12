import { TestBed } from '@angular/core/testing';

import { HttpErrorMessageboxService } from './http-error-messagebox.service';

describe('HttpErrorMessageboxService', () => {
  let service: HttpErrorMessageboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpErrorMessageboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
