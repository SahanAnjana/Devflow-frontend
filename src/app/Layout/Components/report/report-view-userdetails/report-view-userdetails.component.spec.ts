import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewUserdetailsComponent } from './report-view-userdetails.component';

describe('ReportViewUserdetailsComponent', () => {
  let component: ReportViewUserdetailsComponent;
  let fixture: ComponentFixture<ReportViewUserdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewUserdetailsComponent]
    });
    fixture = TestBed.createComponent(ReportViewUserdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
