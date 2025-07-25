import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewBeneficiarydetailsComponent } from './report-view-beneficiarydetails.component';

describe('ReportViewBeneficiarydetailsComponent', () => {
  let component: ReportViewBeneficiarydetailsComponent;
  let fixture: ComponentFixture<ReportViewBeneficiarydetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewBeneficiarydetailsComponent]
    });
    fixture = TestBed.createComponent(ReportViewBeneficiarydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
