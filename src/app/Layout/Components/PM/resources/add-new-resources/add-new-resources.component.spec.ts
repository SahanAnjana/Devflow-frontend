import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewResourcesComponent } from './add-new-resources.component';

describe('AddNewResourcesComponent', () => {
  let component: AddNewResourcesComponent;
  let fixture: ComponentFixture<AddNewResourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewResourcesComponent]
    });
    fixture = TestBed.createComponent(AddNewResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
