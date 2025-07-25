import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewbeneficiariessaveComponent } from './add-newbeneficiariessave.component';

describe('AddNewbeneficiariessaveComponent', () => {
  let component: AddNewbeneficiariessaveComponent;
  let fixture: ComponentFixture<AddNewbeneficiariessaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewbeneficiariessaveComponent]
    });
    fixture = TestBed.createComponent(AddNewbeneficiariessaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
