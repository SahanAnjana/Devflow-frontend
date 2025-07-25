import { TestBed } from '@angular/core/testing';

import { TransferTabService } from './transfer-tab.service';

describe('TransferTabService', () => {
  let service: TransferTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
