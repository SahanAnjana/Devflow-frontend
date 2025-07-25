import { TestBed } from '@angular/core/testing';

import { BenificiaryService } from './benificiary.service';

describe('BenificiaryService', () => {
  let service: BenificiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BenificiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
