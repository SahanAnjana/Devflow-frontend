import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBalanceComponent } from './credit-balance.component';

describe('CreditBalanceComponent', () => {
  let component: CreditBalanceComponent;
  let fixture: ComponentFixture<CreditBalanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditBalanceComponent]
    });
    fixture = TestBed.createComponent(CreditBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
