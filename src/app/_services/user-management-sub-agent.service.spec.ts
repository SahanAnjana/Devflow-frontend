import { TestBed } from '@angular/core/testing';

import { UserManagementSubAgentService } from './user-management-sub-agent.service';

describe('UserManagementSubAgentService', () => {
  let service: UserManagementSubAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagementSubAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
