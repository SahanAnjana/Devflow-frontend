import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFollowDetailsComponent } from './customer-follow-details.component';

describe('CustomerFollowDetailsComponent', () => {
  let component: CustomerFollowDetailsComponent;
  let fixture: ComponentFixture<CustomerFollowDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerFollowDetailsComponent]
    });
    fixture = TestBed.createComponent(CustomerFollowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
