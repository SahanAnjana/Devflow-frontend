import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewLeaveComponent } from './add-new-leave.component';

describe('AddNewLeaveComponent', () => {
  let component: AddNewLeaveComponent;
  let fixture: ComponentFixture<AddNewLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewLeaveComponent]
    });
    fixture = TestBed.createComponent(AddNewLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
