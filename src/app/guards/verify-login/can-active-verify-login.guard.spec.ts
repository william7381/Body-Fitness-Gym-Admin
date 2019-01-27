import { TestBed, async, inject } from '@angular/core/testing';

import { CanActiveVerifyLoginGuard } from './can-active-verify-login.guard';

describe('CanActiveVerifyLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActiveVerifyLoginGuard]
    });
  });

  it('should ...', inject([CanActiveVerifyLoginGuard], (guard: CanActiveVerifyLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
