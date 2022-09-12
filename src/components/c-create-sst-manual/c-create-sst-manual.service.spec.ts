import { TestBed } from '@angular/core/testing';

import { CCreateSstManualService } from './c-create-sst-manual.service';

describe('CCreateSstManualService', () => {
  let service: CCreateSstManualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CCreateSstManualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
