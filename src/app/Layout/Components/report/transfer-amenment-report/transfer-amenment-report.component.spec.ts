import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAmenmentReportComponent } from './transfer-amenment-report.component';

describe('TransferAmenmentReportComponent', () => {
  let component: TransferAmenmentReportComponent;
  let fixture: ComponentFixture<TransferAmenmentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferAmenmentReportComponent]
    });
    fixture = TestBed.createComponent(TransferAmenmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
