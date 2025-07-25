import { TestBed } from '@angular/core/testing';

import { AgentSettingService } from './agent-setting.service';

describe('AgentSettingService', () => {
  let service: AgentSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
