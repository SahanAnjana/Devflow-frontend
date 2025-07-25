import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPendingAffiliateComponent } from './approval-pending-affiliate.component';

describe('ApprovalPendingAffiliateComponent', () => {
  let component: ApprovalPendingAffiliateComponent;
  let fixture: ComponentFixture<ApprovalPendingAffiliateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalPendingAffiliateComponent]
    });
    fixture = TestBed.createComponent(ApprovalPendingAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
