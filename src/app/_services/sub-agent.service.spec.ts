import { TestBed } from '@angular/core/testing';

import { SubAgentService } from './sub-agent.service';

describe('SubAgentService', () => {
  let service: SubAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
