import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutVerifyAgentCustomerComponent } from './without-verify-agent-customer.component';

describe('WithoutVerifyAgentCustomerComponent', () => {
  let component: WithoutVerifyAgentCustomerComponent;
  let fixture: ComponentFixture<WithoutVerifyAgentCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithoutVerifyAgentCustomerComponent]
    });
    fixture = TestBed.createComponent(WithoutVerifyAgentCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
