import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPendingSubAgentComponent } from './verify-pending-sub-agent.component';

describe('VerifyPendingSubAgentComponent', () => {
  let component: VerifyPendingSubAgentComponent;
  let fixture: ComponentFixture<VerifyPendingSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyPendingSubAgentComponent]
    });
    fixture = TestBed.createComponent(VerifyPendingSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
