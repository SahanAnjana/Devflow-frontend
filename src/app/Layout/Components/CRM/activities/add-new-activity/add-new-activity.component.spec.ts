import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewActivityComponent } from './add-new-activity.component';

describe('AddNewActivityComponent', () => {
  let component: AddNewActivityComponent;
  let fixture: ComponentFixture<AddNewActivityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewActivityComponent]
    });
    fixture = TestBed.createComponent(AddNewActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
