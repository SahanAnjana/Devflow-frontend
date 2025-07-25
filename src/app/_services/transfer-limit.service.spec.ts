import { TestBed } from '@angular/core/testing';

import { TransferLimitService } from './transfer-limit.service';

describe('TransferLimitService', () => {
  let service: TransferLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferLimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
