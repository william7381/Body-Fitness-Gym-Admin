import { TestBed } from '@angular/core/testing';

import { ServiceSubscription } from './service-subscription.service';

describe('ServiceSubscription', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceSubscription = TestBed.get(ServiceSubscription);
    expect(service).toBeTruthy();
  });
});
