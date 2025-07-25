import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBeneficiariesComponent } from './add-beneficiaries.component';

describe('AddBeneficiariesComponent', () => {
  let component: AddBeneficiariesComponent;
  let fixture: ComponentFixture<AddBeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBeneficiariesComponent]
    });
    fixture = TestBed.createComponent(AddBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
