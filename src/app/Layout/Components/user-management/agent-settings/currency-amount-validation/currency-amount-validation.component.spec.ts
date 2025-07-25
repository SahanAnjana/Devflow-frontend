import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyAmountValidationComponent } from './currency-amount-validation.component';

describe('CurrencyAmountValidationComponent', () => {
  let component: CurrencyAmountValidationComponent;
  let fixture: ComponentFixture<CurrencyAmountValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyAmountValidationComponent]
    });
    fixture = TestBed.createComponent(CurrencyAmountValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
