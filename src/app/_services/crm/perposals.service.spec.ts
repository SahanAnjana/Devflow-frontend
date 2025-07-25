import { TestBed } from '@angular/core/testing';

import { PerposalsService } from './perposals.service';

describe('PerposalsService', () => {
  let service: PerposalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerposalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
