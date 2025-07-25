import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalPendingSubAgentComponent } from './view-approval-pending-sub-agent.component';

describe('ViewApprovalPendingSubAgentComponent', () => {
  let component: ViewApprovalPendingSubAgentComponent;
  let fixture: ComponentFixture<ViewApprovalPendingSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewApprovalPendingSubAgentComponent]
    });
    fixture = TestBed.createComponent(ViewApprovalPendingSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
