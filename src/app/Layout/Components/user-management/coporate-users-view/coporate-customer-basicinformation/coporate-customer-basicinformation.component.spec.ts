import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoporateCustomerBasicinformationComponent } from './coporate-customer-basicinformation.component';

describe('CoporateCustomerBasicinformationComponent', () => {
  let component: CoporateCustomerBasicinformationComponent;
  let fixture: ComponentFixture<CoporateCustomerBasicinformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoporateCustomerBasicinformationComponent]
    });
    fixture = TestBed.createComponent(CoporateCustomerBasicinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
