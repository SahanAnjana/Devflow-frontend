import { TestBed } from '@angular/core/testing';

import { CoperateuserService } from './coperateuser.service';

describe('CoperateuserService', () => {
  let service: CoperateuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoperateuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
