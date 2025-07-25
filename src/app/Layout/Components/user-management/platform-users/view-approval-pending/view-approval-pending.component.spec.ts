import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalPendingComponent } from './view-approval-pending.component';

describe('ViewApprovalPendingComponent', () => {
  let component: ViewApprovalPendingComponent;
  let fixture: ComponentFixture<ViewApprovalPendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewApprovalPendingComponent]
    });
    fixture = TestBed.createComponent(ViewApprovalPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
