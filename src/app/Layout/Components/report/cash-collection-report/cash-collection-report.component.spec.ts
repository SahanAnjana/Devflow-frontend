import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCollectionReportComponent } from './cash-collection-report.component';

describe('CashCollectionReportComponent', () => {
  let component: CashCollectionReportComponent;
  let fixture: ComponentFixture<CashCollectionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashCollectionReportComponent]
    });
    fixture = TestBed.createComponent(CashCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
