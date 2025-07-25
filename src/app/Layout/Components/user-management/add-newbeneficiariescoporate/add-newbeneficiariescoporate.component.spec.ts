import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewbeneficiariescoporateComponent } from './add-newbeneficiariescoporate.component';

describe('AddNewbeneficiariescoporateComponent', () => {
  let component: AddNewbeneficiariescoporateComponent;
  let fixture: ComponentFixture<AddNewbeneficiariescoporateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewbeneficiariescoporateComponent]
    });
    fixture = TestBed.createComponent(AddNewbeneficiariescoporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
