import { TestBed } from '@angular/core/testing';

import { EventTriggerService } from './eventtrigger.service';

describe('EventtriggerService', () => {
  let service: EventTriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventTriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
