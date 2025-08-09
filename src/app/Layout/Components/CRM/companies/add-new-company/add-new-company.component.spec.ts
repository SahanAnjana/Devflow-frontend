import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCompanyComponent } from './add-new-company.component';

describe('AddNewCompanyComponent', () => {
  let component: AddNewCompanyComponent;
  let fixture: ComponentFixture<AddNewCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewCompanyComponent]
    });
    fixture = TestBed.createComponent(AddNewCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
