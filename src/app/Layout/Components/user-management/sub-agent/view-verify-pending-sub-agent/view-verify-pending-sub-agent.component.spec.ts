import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVerifyPendingSubAgentComponent } from './view-verify-pending-sub-agent.component';

describe('ViewVerifyPendingSubAgentComponent', () => {
  let component: ViewVerifyPendingSubAgentComponent;
  let fixture: ComponentFixture<ViewVerifyPendingSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewVerifyPendingSubAgentComponent]
    });
    fixture = TestBed.createComponent(ViewVerifyPendingSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
