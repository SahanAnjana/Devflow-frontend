import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewContactsComponent } from './add-new-contacts.component';

describe('AddNewContactsComponent', () => {
  let component: AddNewContactsComponent;
  let fixture: ComponentFixture<AddNewContactsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewContactsComponent]
    });
    fixture = TestBed.createComponent(AddNewContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
