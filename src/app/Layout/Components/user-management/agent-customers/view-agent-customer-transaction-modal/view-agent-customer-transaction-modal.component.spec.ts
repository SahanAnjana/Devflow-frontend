import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentCustomerTransactionModalComponent } from './view-agent-customer-transaction-modal.component';

describe('ViewAgentCustomerTransactionModalComponent', () => {
  let component: ViewAgentCustomerTransactionModalComponent;
  let fixture: ComponentFixture<ViewAgentCustomerTransactionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAgentCustomerTransactionModalComponent]
    });
    fixture = TestBed.createComponent(ViewAgentCustomerTransactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
