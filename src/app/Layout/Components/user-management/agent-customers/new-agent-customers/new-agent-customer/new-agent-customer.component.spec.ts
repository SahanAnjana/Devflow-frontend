import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgentCustomerComponent } from './new-agent-customer.component';

describe('NewAgentCustomerComponent', () => {
  let component: NewAgentCustomerComponent;
  let fixture: ComponentFixture<NewAgentCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAgentCustomerComponent]
    });
    fixture = TestBed.createComponent(NewAgentCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
