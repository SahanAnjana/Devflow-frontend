import { TestBed } from '@angular/core/testing';

import { UserManagementAffliateService } from './user-management-affliate.service';

describe('UserManagementAffliateService', () => {
  let service: UserManagementAffliateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagementAffliateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
