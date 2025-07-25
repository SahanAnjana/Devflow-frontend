import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransferFollowDetailsComponent } from './customer-transfer-follow-details.component';

describe('CustomerTransferFollowDetailsComponent', () => {
  let component: CustomerTransferFollowDetailsComponent;
  let fixture: ComponentFixture<CustomerTransferFollowDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerTransferFollowDetailsComponent]
    });
    fixture = TestBed.createComponent(CustomerTransferFollowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
