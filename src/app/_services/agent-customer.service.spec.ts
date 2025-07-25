import { TestBed } from '@angular/core/testing';

import { AgentCustomerService } from './agent-customer.service';

describe('AgentCustomerService', () => {
  let service: AgentCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
