import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewTransferComponent } from './report-view-transfer.component';

describe('ReportViewTransferComponent', () => {
  let component: ReportViewTransferComponent;
  let fixture: ComponentFixture<ReportViewTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewTransferComponent]
    });
    fixture = TestBed.createComponent(ReportViewTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
