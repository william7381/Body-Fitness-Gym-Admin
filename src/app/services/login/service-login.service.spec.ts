import { TestBed, inject } from '@angular/core/testing';

import { ServiceLogin } from './service-login.service';

describe('ServiceLogin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceLogin]
    });
  });

  it('should be created', inject([ServiceLogin], (service: ServiceLogin) => {
    expect(service).toBeTruthy();
  }));
});
