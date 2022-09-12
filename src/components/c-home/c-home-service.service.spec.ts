import { TestBed } from '@angular/core/testing';

import { CHomeServiceService } from './c-home-service.service';

describe('CHomeServiceService', () => {
  let service: CHomeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CHomeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
