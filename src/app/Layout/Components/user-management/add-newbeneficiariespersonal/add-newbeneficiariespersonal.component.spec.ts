import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewbeneficiariespersonalComponent } from './add-newbeneficiariespersonal.component';

describe('AddNewbeneficiariespersonalComponent', () => {
  let component: AddNewbeneficiariespersonalComponent;
  let fixture: ComponentFixture<AddNewbeneficiariespersonalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewbeneficiariespersonalComponent]
    });
    fixture = TestBed.createComponent(AddNewbeneficiariespersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
