import { TestBed } from '@angular/core/testing';

import { CLoginGuard } from './c-login.guard';

describe('CLoginGuard', () => {
  let guard: CLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
