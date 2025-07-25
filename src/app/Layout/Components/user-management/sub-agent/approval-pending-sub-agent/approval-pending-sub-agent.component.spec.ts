import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPendingSubAgentComponent } from './approval-pending-sub-agent.component';

describe('ApprovalPendingSubAgentComponent', () => {
  let component: ApprovalPendingSubAgentComponent;
  let fixture: ComponentFixture<ApprovalPendingSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalPendingSubAgentComponent]
    });
    fixture = TestBed.createComponent(ApprovalPendingSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
