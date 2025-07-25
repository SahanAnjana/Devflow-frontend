import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAgentCommissionReportComponent } from './sub-agent-commission-report.component';

describe('SubAgentCommissionReportComponent', () => {
  let component: SubAgentCommissionReportComponent;
  let fixture: ComponentFixture<SubAgentCommissionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubAgentCommissionReportComponent]
    });
    fixture = TestBed.createComponent(SubAgentCommissionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
