import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDualRegistrationComponent } from './customer-dual-registration.component';

describe('CustomerDualRegistrationComponent', () => {
  let component: CustomerDualRegistrationComponent;
  let fixture: ComponentFixture<CustomerDualRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerDualRegistrationComponent]
    });
    fixture = TestBed.createComponent(CustomerDualRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
