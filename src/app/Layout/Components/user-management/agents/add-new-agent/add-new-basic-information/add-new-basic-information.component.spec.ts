import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBasicInformationComponent } from './add-new-basic-information.component';

describe('AddNewBasicInformationComponent', () => {
  let component: AddNewBasicInformationComponent;
  let fixture: ComponentFixture<AddNewBasicInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewBasicInformationComponent]
    });
    fixture = TestBed.createComponent(AddNewBasicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
