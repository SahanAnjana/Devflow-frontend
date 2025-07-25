import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSummaryReportComponent } from './transfer-summary-report.component';

describe('TransferSummaryReportComponent', () => {
  let component: TransferSummaryReportComponent;
  let fixture: ComponentFixture<TransferSummaryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferSummaryReportComponent]
    });
    fixture = TestBed.createComponent(TransferSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
