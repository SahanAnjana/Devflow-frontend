import { TestBed } from '@angular/core/testing';

import { EventtriggerService } from './eventtrigger.service';

describe('EventtriggerService', () => {
  let service: EventtriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventtriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
