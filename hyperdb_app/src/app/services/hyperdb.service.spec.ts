import { TestBed } from '@angular/core/testing';

import { HyperdbService } from './hyperdb.service';

describe('HyperdbService', () => {
  let service: HyperdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HyperdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
