import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewbeneficiariesComponent } from './add-newbeneficiaries.component';

describe('AddNewbeneficiariesComponent', () => {
  let component: AddNewbeneficiariesComponent;
  let fixture: ComponentFixture<AddNewbeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewbeneficiariesComponent]
    });
    fixture = TestBed.createComponent(AddNewbeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
