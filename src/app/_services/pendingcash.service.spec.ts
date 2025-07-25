import { TestBed } from '@angular/core/testing';

import { PendingcashService } from './pendingcash.service';

describe('PendingcashService', () => {
  let service: PendingcashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingcashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
