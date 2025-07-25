import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPendingAgentCustomersComponent } from './approval-pending-agent-customers.component';

describe('ApprovalPendingAgentCustomersComponent', () => {
  let component: ApprovalPendingAgentCustomersComponent;
  let fixture: ComponentFixture<ApprovalPendingAgentCustomersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalPendingAgentCustomersComponent]
    });
    fixture = TestBed.createComponent(ApprovalPendingAgentCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
