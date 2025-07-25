import { TestBed } from '@angular/core/testing';

import { ReportNotesService } from './report-notes.service';

describe('ReportNotesService', () => {
  let service: ReportNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
