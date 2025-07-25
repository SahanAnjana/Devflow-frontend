import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayBillTransfersComponent } from './pay-bill-transfers.component';

describe('PayBillTransfersComponent', () => {
  let component: PayBillTransfersComponent;
  let fixture: ComponentFixture<PayBillTransfersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayBillTransfersComponent]
    });
    fixture = TestBed.createComponent(PayBillTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
