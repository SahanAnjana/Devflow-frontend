import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCommunicationComponent } from './add-new-communication.component';

describe('AddNewCommunicationComponent', () => {
  let component: AddNewCommunicationComponent;
  let fixture: ComponentFixture<AddNewCommunicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewCommunicationComponent]
    });
    fixture = TestBed.createComponent(AddNewCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
