import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewTransferinvoiceComponent } from './report-view-transferinvoice.component';

describe('ReportViewTransferinvoiceComponent', () => {
  let component: ReportViewTransferinvoiceComponent;
  let fixture: ComponentFixture<ReportViewTransferinvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewTransferinvoiceComponent]
    });
    fixture = TestBed.createComponent(ReportViewTransferinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
