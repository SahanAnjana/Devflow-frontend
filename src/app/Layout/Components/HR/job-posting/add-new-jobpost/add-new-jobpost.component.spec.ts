import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewJobpostComponent } from './add-new-jobpost.component';

describe('AddNewJobpostComponent', () => {
  let component: AddNewJobpostComponent;
  let fixture: ComponentFixture<AddNewJobpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewJobpostComponent]
    });
    fixture = TestBed.createComponent(AddNewJobpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
