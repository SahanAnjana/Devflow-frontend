import { TestBed } from '@angular/core/testing';

import { SubAgentSettingsService } from './sub-agent-settings.service';

describe('SubAgentSettingsService', () => {
  let service: SubAgentSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubAgentSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
