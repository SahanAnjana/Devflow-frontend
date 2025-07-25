import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDocumentationComponent } from './add-new-documentation.component';

describe('AddNewDocumentationComponent', () => {
  let component: AddNewDocumentationComponent;
  let fixture: ComponentFixture<AddNewDocumentationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewDocumentationComponent]
    });
    fixture = TestBed.createComponent(AddNewDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
