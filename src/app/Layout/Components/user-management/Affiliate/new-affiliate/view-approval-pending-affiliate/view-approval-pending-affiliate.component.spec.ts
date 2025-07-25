import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalPendingAffiliateComponent } from './view-approval-pending-affiliate.component';

describe('ViewApprovalPendingAffiliateComponent', () => {
  let component: ViewApprovalPendingAffiliateComponent;
  let fixture: ComponentFixture<ViewApprovalPendingAffiliateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewApprovalPendingAffiliateComponent]
    });
    fixture = TestBed.createComponent(ViewApprovalPendingAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
