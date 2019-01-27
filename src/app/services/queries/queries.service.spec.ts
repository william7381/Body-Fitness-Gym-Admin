import { TestBed } from '@angular/core/testing';

import { ServiceQueries } from './service-queries.service';

describe('ServiceQueries', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceQueries = TestBed.get(ServiceQueries);
    expect(service).toBeTruthy();
  });
});
