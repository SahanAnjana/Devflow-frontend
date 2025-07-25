import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentCustomerComponent } from './view-agent-customer.component';

describe('ViewAgentCustomerComponent', () => {
  let component: ViewAgentCustomerComponent;
  let fixture: ComponentFixture<ViewAgentCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAgentCustomerComponent]
    });
    fixture = TestBed.createComponent(ViewAgentCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
