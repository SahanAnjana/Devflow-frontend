import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPendingAffiliateComponent } from './verify-pending-affiliate.component';

describe('VerifyPendingAffiliateComponent', () => {
  let component: VerifyPendingAffiliateComponent;
  let fixture: ComponentFixture<VerifyPendingAffiliateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyPendingAffiliateComponent]
    });
    fixture = TestBed.createComponent(VerifyPendingAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
