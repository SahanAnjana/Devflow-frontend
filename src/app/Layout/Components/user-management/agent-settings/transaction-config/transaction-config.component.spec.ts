import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionConfigComponent } from './transaction-config.component';

describe('TransactionConfigComponent', () => {
  let component: TransactionConfigComponent;
  let fixture: ComponentFixture<TransactionConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionConfigComponent]
    });
    fixture = TestBed.createComponent(TransactionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
