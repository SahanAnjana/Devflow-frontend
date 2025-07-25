import { TestBed } from '@angular/core/testing';

import { UsermanagementAffliateNewAffliateService } from './usermanagement-affliate-new-affliate.service';

describe('UsermanagementAffliateNewAffliateService', () => {
  let service: UsermanagementAffliateNewAffliateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermanagementAffliateNewAffliateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
