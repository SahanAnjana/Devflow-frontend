import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotesModalComponent } from './add-notes-modal.component';

describe('AddNotesModalComponent', () => {
  let component: AddNotesModalComponent;
  let fixture: ComponentFixture<AddNotesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNotesModalComponent]
    });
    fixture = TestBed.createComponent(AddNotesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
