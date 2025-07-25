import { TestBed } from '@angular/core/testing';

import { MakeTransferService } from './make-transfer.service';

describe('MakeTransferService', () => {
  let service: MakeTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakeTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
