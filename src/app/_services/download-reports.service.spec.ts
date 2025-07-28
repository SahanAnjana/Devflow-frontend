import { TestBed } from '@angular/core/testing';

import { DownloadReportsService } from './download-reports.service';

describe('DownloadReportsService', () => {
  let service: DownloadReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
