import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryDetailsComponent } from './beneficiary-details.component';

describe('BeneficiaryDetailsComponent', () => {
  let component: BeneficiaryDetailsComponent;
  let fixture: ComponentFixture<BeneficiaryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiaryDetailsComponent]
    });
    fixture = TestBed.createComponent(BeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
