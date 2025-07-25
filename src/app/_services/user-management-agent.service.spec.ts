import { TestBed } from '@angular/core/testing';

import { UserManagementAgentService } from './user-management-agent.service';

describe('UserManagementAgentService', () => {
  let service: UserManagementAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagementAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
