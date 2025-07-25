import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAmountComponent } from './transfer-amount.component';

describe('TransferAmountComponent', () => {
  let component: TransferAmountComponent;
  let fixture: ComponentFixture<TransferAmountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferAmountComponent]
    });
    fixture = TestBed.createComponent(TransferAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
