import { TestBed } from '@angular/core/testing';

import { ServiceDataTemp } from './service-temp.service';

describe('ServiceDataTemp', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceDataTemp = TestBed.get(ServiceDataTemp);
    expect(service).toBeTruthy();
  });
});
