import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryTransactionComponent } from './beneficiary-transaction.component';

describe('BeneficiaryTransactionComponent', () => {
  let component: BeneficiaryTransactionComponent;
  let fixture: ComponentFixture<BeneficiaryTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiaryTransactionComponent]
    });
    fixture = TestBed.createComponent(BeneficiaryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
