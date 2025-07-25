import { TestBed } from '@angular/core/testing';

import { UserManagementPlatformUserService } from './user-management-platform-user.service';

describe('UserManagementPlatformUserService', () => {
  let service: UserManagementPlatformUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagementPlatformUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
