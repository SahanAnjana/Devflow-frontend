import { TestBed } from '@angular/core/testing';

import { TestcasesService } from './testcases.service';

describe('TestcasesService', () => {
  let service: TestcasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestcasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
