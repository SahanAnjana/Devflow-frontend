import { TestBed } from '@angular/core/testing';

import { LaevesService } from './laeves.service';

describe('LaevesService', () => {
  let service: LaevesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaevesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
