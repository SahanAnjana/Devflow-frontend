import { TestBed } from '@angular/core/testing';

import { RolemanagementService } from './rolemanagement.service';

describe('RolemanagementService', () => {
  let service: RolemanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolemanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
